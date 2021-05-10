import { graphQuery } from './apollo';
import { ADDRESS_BALANCES, BANK_BALANCES } from '../graphQL/bank-queries';
import { DAO_ACTIVITIES, HOME_DAO } from '../graphQL/dao-queries';
import { MEMBERS_LIST } from '../graphQL/member-queries';
import {
  proposalResolver,
  daoResolver,
  daosqaureCcoDaoResolver,
} from './resolvers';
import { getGraphEndpoint, supportedChains } from './chain';
import { fetchTokenData } from './tokenValue';
import { omit } from './general';
import { UBERHAUS_QUERY, UBER_MINIONS } from '../graphQL/uberhaus-queries';
import { UBERHAUS_DATA } from './uberhaus';
import { getApiMetadata, getDateTime } from './metadata';
import { CCO_CONSTANTS } from './cco';

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
    if (newItems.length === 100) {
      return graphFetchAll(args, [...newItems, ...items], skip + 100);
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

const fetchAllActivity = async (args, items = [], skip = 0) => {
  try {
    const result = await graphQuery({
      endpoint: getGraphEndpoint(args.chainID, 'subgraph_url'),
      query: DAO_ACTIVITIES,
      variables: {
        contractAddr: args.daoID,
        skip,
      },
    });
    const { proposals } = result.moloch;
    if (proposals.length === 100) {
      return fetchAllActivity(args, [...items, ...proposals], skip + 100);
    }
    return { ...result.moloch, proposals: [...items, ...proposals] };
  } catch (error) {
    throw new Error(error);
  }
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
      setter(graphOverview.moloch);
    } catch (error) {
      console.error(error);
    }
  },
  async getActivities(args, setter) {
    try {
      const activity = await fetchAllActivity(args);

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
      if (setter.setUberActivities) {
        setter.setUberActivities(resolvedActivity.proposals);
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

export const daosqaureCcoQuery = async ({ query, reactSetter, apiFetcher }) => {
  const chain = supportedChains[CCO_CONSTANTS.DAOSQUARE_NETWORK];
  const metaDataMap = await apiFetcher();

  const daoMapLookup = (address, chainName) => {
    const daoMatch = metaDataMap[address] || [];
    return daoMatch.find(dao => dao.network === chainName) || null;
  };
  try {
    const chainData = await graphFetchAll({
      endpoint: chain.subgraph_url,
      query,
      subfield: 'moloches',
    });

    const withMetaData = chainData
      .map(dao => {
        return {
          ...dao,
          meta: daoMapLookup(dao?.id, chain.network),
        };
      })
      .filter(dao => {
        return dao?.meta?.daosquarecco;
      });

    const date = await getDateTime();
    const now = Number(date.seconds);

    const withCcoMeta = withMetaData.map(dao => {
      return daosqaureCcoDaoResolver(dao, now);
    });

    reactSetter(withCcoMeta);
  } catch (error) {
    console.error(error);
  }
};
