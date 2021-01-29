import { graphQuery } from './apollo';
import { BANK_BALANCES } from '../graphQL/bank-queries';
import { GET_TRANSMUTATION } from '../graphQL/boost-queries';
import { DAO_ACTIVITIES, HOME_DAO } from '../graphQL/dao-queries';
import { MEMBERS_LIST } from '../graphQL/member-queries';
import { proposalResolver, daoResolver } from '../utils/resolvers';
import { getGraphEndpoint } from '../utils/chain';
import { fetchTokenData } from '../utils/tokenValue';
import { omit } from './general';

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
    } else {
      return [...items, ...newItems];
    }
  } catch (error) {
    console.error(error);
  }
};

export const fetchBankValues = async (args) => {
  return graphFetchAll({
    endpoint: getGraphEndpoint(args.chainID, 'stats_graph_url'),
    query: BANK_BALANCES,
    subfield: 'balances',
    variables: {
      molochAddress: args.daoID,
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
    } else {
      return { ...result.moloch, proposals: [...items, ...proposals] };
    }
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
        proposals: activity.proposals.map((proposal) =>
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
      setter.setDaoActivities(resolvedActivity);
      setter.setDaoProposals(resolvedActivity.proposals);
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
  async getTransmutations(args, setter) {
    try {
      const transmutations = await graphQuery({
        endpoint: getGraphEndpoint(args.chainID, 'boosts_graph_url'),
        query: GET_TRANSMUTATION,
        variables: {
          contractAddress: args.daoID,
        },
      });
      setter(transmutations);
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
    array = [
      ...array,
      {
        name: supportedChains[chain].name,
        endpoint: supportedChains[chain][endpointType],
        networkID: chain,
        network_id: supportedChains[chain].network_id,
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
}) => {
  const metaDataMap = await apiFetcher();

  const daoMapLookup = (address, chainName) => {
    const daoMatch = metaDataMap[address] || [];
    return daoMatch.find((dao) => dao.network === chainName) || null;
  };
  buildCrossChainQuery(supportedChains, endpointType).forEach(async (chain) => {
    try {
      const chainData = await graphQuery({
        endpoint: chain.endpoint,
        query,
        variables,
      });

      const withMetaData = chainData?.membersHub.map((dao) => {
        const withResolvedProposals = {
          ...dao,
          moloch: {
            ...omit('proposals', dao.moloch),
            proposals: dao.moloch.proposals.map((proposal) =>
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
      });

      reactSetter((prevState) => [
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
    return daoMatch.find((dao) => dao.network === chainName) || null;
  };
  buildCrossChainQuery(supportedChains, endpointType).forEach(async (chain) => {
    try {
      const chainData = await graphFetchAll({
        endpoint: chain.endpoint,
        query,
        subfield: 'moloches',
      });

      const withMetaData = chainData.map((dao) => {
        const withResolvedDao = daoResolver(dao, { prices, chain });
        return {
          ...withResolvedDao,
          meta: daoMapLookup(dao?.id, chain.apiMatch),
        };
      });

      reactSetter((prevState) => {
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
