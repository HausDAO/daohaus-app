import { graphQuery } from './apollo';
import { ADDRESS_BALANCES, BANK_BALANCES } from '../graphQL/bank-queries';
import {
  ALT_ACTIVITIES,
  ALT_AGAIN,
  DAO_ACTIVITIES,
  HOME_DAO,
} from '../graphQL/dao-queries';
import { MEMBERS_LIST } from '../graphQL/member-queries';
import { UBERHAUS_QUERY, UBER_MINIONS } from '../graphQL/uberhaus-queries';
import { getGraphEndpoint, supportedChains } from './chain';
import { omit } from './general';
import { getApiMetadata, fetchApiVaultData } from './metadata';
import {
  GET_ERC721,
  GET_ERC1155,
  GET_POAP,
  GET_TRANSMUTATION,
  GET_WRAP_N_ZAPS,
} from '../graphQL/boost-queries';
import { MINION_TYPES } from './proposalUtils';
import { proposalResolver, daoResolver } from './resolvers';
import { calcTotalUSD, fetchTokenData } from './tokenValue';
import { UBERHAUS_DATA } from './uberhaus';
import { validateSafeMinion } from './vaults';
import { ALT } from '../data/temp';

export const graphFetchAll = async (args, items = [], skip = 0) => {
  try {
    const { endpoint, query, variables, subfield } = args;
    const result = await graphQuery({
      endpoint,
      query,
      variables: {
        ...variables,
        skip,
      },
    });
    const newItems = result[subfield];
    if (newItems.length === 1000) {
      return graphFetchAll(args, [...newItems, ...items], skip + 1000);
    }
    return [...items, ...newItems];
  } catch (error) {
    console.error(error);
  }
};

export const fetchBankValues = async args => {
  return graphFetchAll({
    endpoint: getGraphEndpoint(args.chainID, 'stats_graph_url'),
    query: BANK_BALANCES,
    subfield: 'balances',
    variables: {
      molochAddress: args.daoID,
    },
  });
};

export const fetchUberHausData = async args => {
  return graphQuery({
    endpoint: getGraphEndpoint(args.chainID, 'subgraph_url'),
    query: UBERHAUS_QUERY,
    variables: {
      molochAddress: args.molochAddress,
      memberAddress: args.memberAddress,
      minionId: args.minionId,
    },
  });
};

export const getWrapNZap = async (daochain, daoid) => {
  const records = await graphQuery({
    endpoint: getGraphEndpoint(daochain, 'boosts_graph_url'),
    query: GET_WRAP_N_ZAPS,
    variables: {
      contractAddress: daoid,
    },
  });
  if (records.wrapNZaps?.length > 0) {
    return records.wrapNZaps[0].id;
  }
  return null;
};

export const fetchTransmutation = async args => {
  return graphQuery({
    endpoint: getGraphEndpoint(args.chainID, 'boosts_graph_url'),
    query: GET_TRANSMUTATION,
    variables: {
      contractAddress: args.molochAddress,
    },
  });
};

export const fetchErc721s = async args => {
  return graphQuery({
    endpoint: getGraphEndpoint(args.chainID, 'erc721_graph_url'),
    query: GET_ERC721,
    variables: {
      tokenHolder: args.address,
    },
  });
};

export const fetchErc1155s = async args => {
  return graphQuery({
    endpoint: getGraphEndpoint(args.chainID, 'erc1155_graph_url'),
    query: GET_ERC1155,
    variables: {
      tokenHolder: args.address,
    },
  });
};

export const fetchPoapAddresses = async args => {
  return graphQuery({
    endpoint: getGraphEndpoint('0x64', 'poap_graph_url'),
    query: GET_POAP,
    variables: {
      eventId: args.eventId,
    },
  });
};

export const fetchMinionInternalBalances = async args => {
  const metadata = await getApiMetadata();
  const internalBalances = await graphQuery({
    endpoint: getGraphEndpoint(args.chainID, 'subgraph_url'),
    query: ADDRESS_BALANCES,
    subfield: 'addressBalances',
    variables: {
      memberAddress: args.minionAddress,
    },
  });

  return internalBalances.addressBalances.map(bal => {
    const meta = metadata[bal.moloch.id] ? metadata[bal.moloch.id][0] : {};
    return { ...bal, meta };
  });
};

const fetchAllActivity = async (
  args,
  items = [],
  skip = 0,
  query = DAO_ACTIVITIES,
) => {
  try {
    const result = await graphQuery({
      endpoint: getGraphEndpoint(args.chainID, 'subgraph_url'),
      query,
      variables: {
        contractAddr: args.daoID,
        skip,
      },
    });
    const { proposals } = result.moloch;
    if (proposals.length === 100) {
      //  TESTING ONLY
      // if (skip === 400) {
      //   return { ...result.moloch, proposals: [...items, ...proposals] };
      // }
      return fetchAllActivity(
        args,
        [...items, ...proposals],
        skip + 100,
        query,
      );
    }
    return { ...result.moloch, proposals: [...items, ...proposals] };
  } catch (error) {
    throw new Error(error);
  }
};

const fetchAltActivity = async (args, items = [], skip = 0) => {
  const sponsored = await fetchAllActivity(args, items, skip, ALT_ACTIVITIES);
  const unsponsored = await fetchAllActivity(args, items, skip, ALT_AGAIN);

  return {
    id: sponsored.id,
    rageQuits: sponsored.rageQuits,
    title: sponsored.title,
    version: sponsored.version,
    proposals: [...sponsored?.proposals, ...unsponsored?.proposals],
  };
};

const completeQueries = {
  async getOverview(args, setter) {
    try {
      const graphOverview = await graphQuery({
        endpoint: getGraphEndpoint(args.chainID, 'subgraph_url'),
        query: HOME_DAO,
        variables: {
          contractAddr: args.daoID,
        },
      });

      if (setter.setDaoOverview) {
        setter.setDaoOverview(graphOverview.moloch);
      }

      if (setter.setDaoVaults) {
        const minionAddresses = graphOverview.moloch.minions.map(
          minion => minion.minionAddress,
        );

        const prices = await fetchTokenData();
        const vaultApiData = await fetchApiVaultData(
          supportedChains[args.chainID].network,
          minionAddresses,
        );
        const vaultData = await Promise.all(
          vaultApiData.map(async vault => {
            if (vault.minionType === MINION_TYPES.SAFE) {
              const { isMinionModule } = await validateSafeMinion(
                args.chainID,
                vault,
              );
              return {
                ...vault,
                isMinionModule,
              };
            }
            return vault;
          }),
        );

        const balanceData = await fetchBankValues({
          daoID: args.daoID,
          chainID: args.chainID,
        });

        const guildBank = {
          type: 'treasury',
          name: 'DAO Treasury',
          address: args.daoID,
          currentBalance: '',
          erc20s: graphOverview.moloch.tokenBalances.map(token => {
            const priceData = prices[token.token.tokenAddress];
            return {
              ...token,
              ...priceData,
              usd: priceData?.price,
              totalUSD: calcTotalUSD(
                token.token.decimals,
                token.tokenBalance,
                priceData?.price || 0,
              ),
            };
          }),
          nfts: [],
          balanceHistory: balanceData,
        };
        setter.setDaoVaults([guildBank, ...vaultData]);
      }
    } catch (error) {
      console.error(error);
    }
  },
  async getActivities(args, setter) {
    try {
      const isAlt = ALT.includes(args.daoID);
      const activity = isAlt
        ? await fetchAltActivity(args)
        : await fetchAllActivity(args);

      const resolvedActivity = {
        // manually copying to prevent unnecessary copies of proposals
        id: activity.id,
        rageQuits: activity.rageQuits,
        title: activity.title,
        version: activity.version,
        proposals: activity.proposals.map(proposal =>
          proposalResolver(proposal, {
            status: true,
            title: true,
            description: true,
            link: true,
            hash: true,
            proposalType: true,
          }),
        ),
      };

      if (setter.setDaoActivities) {
        setter.setDaoActivities(resolvedActivity);
      }
      if (setter.setDaoProposals) {
        setter.setDaoProposals(resolvedActivity.proposals);
      }
      if (setter.setUberProposals) {
        setter.setUberProposals(resolvedActivity.proposals);
      }
    } catch (error) {
      console.error(error);
    }
  },
  async getMembers(args, setter) {
    try {
      const graphMembers = await graphFetchAll({
        endpoint: getGraphEndpoint(args.chainID, 'subgraph_url'),
        query: MEMBERS_LIST,
        subfield: 'daoMembers',
        variables: {
          contractAddr: args.daoID,
        },
      });

      setter(graphMembers);
    } catch (error) {
      console.error(error);
    }
  },
  async uberMinionData(args, setter) {
    if (args.daoID === UBERHAUS_DATA.ADDRESS) {
      try {
        const uberMinions = await graphQuery({
          endpoint: getGraphEndpoint(args.chainID, 'subgraph_url'),
          query: UBER_MINIONS,
          variables: {
            minionType: 'UberHaus minion',
            molochAddress: args.daoID,
          },
        });

        setter(uberMinions?.minions);
      } catch (error) {
        console.error(error);
      }
    } else {
      setter(null);
    }
  },
};

export const bigGraphQuery = ({ args, getSetters }) => {
  for (const getSetter of getSetters) {
    const { getter, setter } = getSetter;
    completeQueries[getter](args, setter);
  }
};

const buildCrossChainQuery = (supportedChains, endpointType) => {
  let array = [];

  for (const chain in supportedChains) {
    array = [
      ...array,
      {
        name: supportedChains[chain].name,
        endpoint: supportedChains[chain][endpointType],
        networkID: chain,
        network_id: supportedChains[chain].network_id,
        hubSortOrder: supportedChains[chain].hub_sort_order,
        apiMatch: chain === '0x64' ? 'xdai' : supportedChains[chain].network,
      },
    ];
  }
  return array;
};

export const hubChainQuery = async ({
  query,
  supportedChains,
  endpointType,
  reactSetter,
  apiFetcher,
  variables,
  setApiData,
}) => {
  const metaDataMap = await apiFetcher();
  setApiData(metaDataMap);

  const daoMapLookup = (address, chainName) => {
    const daoMatch = metaDataMap[address] || [];

    return daoMatch.find(dao => dao.network === chainName) || null;
  };
  buildCrossChainQuery(supportedChains, endpointType).forEach(async chain => {
    try {
      const chainData = await graphQuery({
        endpoint: chain.endpoint,
        query,
        variables,
      });

      const withMetaData = chainData?.membersHub
        .map(dao => {
          const withResolvedProposals = {
            ...dao,
            moloch: {
              ...omit('proposals', dao.moloch),
              proposals: dao.moloch.proposals.map(proposal =>
                proposalResolver(proposal, {
                  proposalType: true,
                  description: true,
                  title: true,
                  activityFeed: true,
                }),
              ),
            },
          };

          return {
            ...withResolvedProposals,
            meta: daoMapLookup(dao?.moloch?.id, chain.apiMatch),
          };
        })
        .filter(dao => {
          const notHiddenAndHasMetaOrIsUnregisteredSummoner =
            (dao.meta && !dao.meta.hide) ||
            (!dao.meta &&
              variables.memberAddress.toLowerCase() === dao.moloch.summoner);
          return notHiddenAndHasMetaOrIsUnregisteredSummoner;
        });

      reactSetter(prevState => [
        ...prevState,
        { ...chain, data: withMetaData },
      ]);
    } catch (error) {
      console.error(error);
    }
  });
};

export const exploreChainQuery = async ({
  query,
  supportedChains,
  endpointType,
  reactSetter,
  apiFetcher,
}) => {
  const metaDataMap = await apiFetcher();
  const prices = await fetchTokenData();

  const daoMapLookup = (address, chainName) => {
    const daoMatch = metaDataMap[address] || [];
    return daoMatch.find(dao => dao.network === chainName) || null;
  };
  buildCrossChainQuery(supportedChains, endpointType).forEach(async chain => {
    try {
      const chainData = await graphFetchAll({
        endpoint: chain.endpoint,
        query,
        subfield: 'moloches',
      });

      const withMetaData = chainData
        .map(dao => {
          const withResolvedDao = daoResolver(dao, { prices, chain });
          return {
            ...withResolvedDao,
            meta: daoMapLookup(dao?.id, chain.apiMatch),
          };
        })
        .filter(dao => !dao.meta || !dao.meta.hide);

      reactSetter(prevState => {
        return {
          chains: [...prevState.chains, chain],
          data: [...prevState.data, ...withMetaData],
        };
      });
    } catch (error) {
      console.error(error);
    }
  });
};

export const balanceChainQuery = async ({ address, reactSetter }) => {
  const metaDataMap = await getApiMetadata();

  const daoMapLookup = (address, chainName) => {
    const daoMatch = metaDataMap[address] || [];
    return daoMatch.find(dao => dao.network === chainName) || null;
  };
  buildCrossChainQuery(supportedChains, 'subgraph_url').forEach(async chain => {
    try {
      const chainData = await graphFetchAll({
        endpoint: chain.endpoint,
        query: ADDRESS_BALANCES,
        subfield: 'addressBalances',
        variables: {
          memberAddress: address,
        },
      });

      const withMetaData = chainData.map(member => {
        return {
          ...member,
          meta: daoMapLookup(member.moloch?.id, chain.apiMatch),
        };
      });

      reactSetter(prevState => {
        return {
          chains: [...prevState.chains, chain],
          data: [...prevState.data, ...withMetaData],
        };
      });
    } catch (error) {
      console.error(error);
    }
  });
};
