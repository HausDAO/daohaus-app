import { graphQuery } from './apollo';
import { ADDRESS_BALANCES, BANK_BALANCES } from '../graphQL/bank-queries';
import {
  DAO_ACTIVITIES,
  HOME_DAO,
  HOME_DAO_TOKENS,
  SINGLE_PROPOSAL,
  SINGLE_MEMBER,
  SPAM_FILTER_ACTIVITIES,
  SPAM_FILTER_GK_WL,
  SPAM_FILTER_TRIBUTE,
} from '../graphQL/dao-queries';
import { MEMBERS_LIST } from '../graphQL/member-queries';
import {
  SNAPSHOT_SPACE_QUERY,
  SNAPSHOT_PROPOSALS_QUERY,
  SNAPSHOT_VOTES_QUERY,
} from '../graphQL/snapshot-queries';
import { getGraphEndpoint, supportedChains } from './chain';
import { omit } from './general';
import { isModuleEnabled } from './gnosis';
import { getApiMetadata, fetchApiVaultData, fetchMetaData } from './metadata';
import {
  GET_ERC721,
  GET_ERC1155,
  GET_POAP,
  GET_TRANSMUTATION,
  GET_WRAP_N_ZAPS,
  GET_MINION_BY_NAME,
  GET_MOLOCH_TOKEN,
} from '../graphQL/boost-queries';
import { MINION_TYPES } from './proposalUtils';
import { proposalResolver, daoResolver } from './resolvers';
import { calcTotalUSD, fetchTokenData } from './tokenValue';

const SNAPSHOT_ENDPOINT = 'https://hub.snapshot.org/graphql';

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

export const getSnapshotSpaces = async id => {
  try {
    return graphQuery({
      endpoint: SNAPSHOT_ENDPOINT,
      query: SNAPSHOT_SPACE_QUERY,
      variables: {
        id,
      },
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const getSnapshotProposals = async id => {
  try {
    return graphQuery({
      endpoint: SNAPSHOT_ENDPOINT,
      query: SNAPSHOT_PROPOSALS_QUERY,
      variables: {
        id,
      },
    });
  } catch (err) {
    throw new Error(err);
  }
};

export const getSnapshotVotes = async id => {
  try {
    return graphQuery({
      endpoint: SNAPSHOT_ENDPOINT,
      query: SNAPSHOT_VOTES_QUERY,
      variables: {
        id,
      },
    });
  } catch (err) {
    throw new Error(err);
  }
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

export const fetchMinionByName = async args => {
  return graphQuery({
    endpoint: getGraphEndpoint(args.chainID, 'subgraph_url'),
    query: GET_MINION_BY_NAME,
    variables: {
      minionName: args.minionName,
      molochAddress: args.molochAddress,
    },
  });
};

export const fetchSingleProposal = async args => {
  return graphQuery({
    endpoint: getGraphEndpoint(args.chainID, 'subgraph_url'),
    query: SINGLE_PROPOSAL,
    variables: {
      molochAddress: args.molochAddress,
      proposalId: args.proposalId,
    },
  });
};

export const fetchSingleMember = async args => {
  return graphQuery({
    endpoint: getGraphEndpoint(args.chainID, 'subgraph_url'),
    query: SINGLE_MEMBER,
    variables: {
      id: `${args.molochAddress}-member-${args.memberAddress}`,
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

export const fetchAllActivity = async (
  args,
  items = [],
  createdAt = '0',
  count = 1,
  query = DAO_ACTIVITIES,
  variables = {},
) => {
  try {
    const result = await graphQuery({
      endpoint: getGraphEndpoint(args.chainID, 'subgraph_url'),
      query,
      variables: {
        contractAddr: args.daoID,
        createdAt,
        ...variables,
      },
    });

    const { proposals } = result;
    count = proposals.length;
    if (count > 0) {
      const lastRecord = proposals[count - 1];
      createdAt = lastRecord && lastRecord.createdAt;

      return fetchAllActivity(
        args,
        [...items, ...proposals],
        createdAt,
        count,
        query,
        variables,
      );
    }
    return { ...result, proposals: [...items, ...proposals] };
  } catch (error) {
    throw new Error(error);
  }
};

const fetchSpamFilterActivity = async (
  args,
  items = [],
  createdAt = '0',
  count = 1,
) => {
  const sponsored = await fetchAllActivity(
    args,
    items,
    createdAt,
    count,
    SPAM_FILTER_ACTIVITIES,
  );
  const unsponsoredGuildkickWhitelist = await fetchAllActivity(
    args,
    items,
    createdAt,
    count,
    SPAM_FILTER_GK_WL,
  );
  const unsponsoredTribute = await fetchAllActivity(
    args,
    items,
    createdAt,
    count,
    SPAM_FILTER_TRIBUTE,
    {
      requiredTributeMin: args.requiredTributeMin,
      requiredTributeToken: args.requiredTributeToken,
    },
  );

  return {
    id: args.daoID,
    rageQuits: sponsored.rageQuits,
    proposals: [
      ...sponsored?.proposals,
      ...unsponsoredGuildkickWhitelist?.proposals,
      ...unsponsoredTribute?.proposals,
    ],
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

      const daoTokenBalances = await graphQuery({
        endpoint: getGraphEndpoint(args.chainID, 'subgraph_url'),
        query: HOME_DAO_TOKENS,
        variables: {
          contractAddr: args.daoID,
        },
      });

      if (setter.setDaoOverview) {
        setter.setDaoOverview({
          ...graphOverview.moloch,
          tokenBalances: daoTokenBalances.tokenBalances,
        });
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
              try {
                const minion = graphOverview.moloch.minions.find(
                  minion => minion.minionAddress === vault.address,
                );
                const isMinionModule = await isModuleEnabled(
                  args.chainID,
                  vault.safeAddress,
                  vault.address,
                );
                return {
                  ...vault,
                  isMinionModule,
                  minQuorum: minion.minQuorum,
                };
              } catch (error) {
                console.error(error);
              }
              return vault;
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
          erc20s: daoTokenBalances.tokenBalances.map(token => {
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
      const metadata = await fetchMetaData(args.daoID);

      const activity = metadata[0]?.boosts?.SPAM_FILTER?.active
        ? await fetchSpamFilterActivity({
            ...args,
            requiredTributeToken:
              metadata[0].boosts.SPAM_FILTER.metadata.paymentToken,
            requiredTributeMin:
              metadata[0].boosts.SPAM_FILTER.metadata.paymentRequested,
          })
        : await fetchAllActivity(args);

      const resolvedActivity = {
        id: args.daoID,
        rageQuits: activity.rageQuits,
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
    if (!supportedChains[chain][endpointType]) continue;
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

          const hasNoSharesLoot =
            Number(dao.shares) > 0 || Number(dao.loot) > 0;

          return notHiddenAndHasMetaOrIsUnregisteredSummoner && hasNoSharesLoot;
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

export const getMolochToken = async (daochain, daoid) => {
  const records = await graphQuery({
    endpoint: getGraphEndpoint(daochain, 'boosts_graph_url'),
    query: GET_MOLOCH_TOKEN,
    variables: {
      contractAddress: daoid,
    },
  });
  if (records.molochTokens?.length > 0) {
    return records.molochTokens[0].id;
  }
  return null;
};
