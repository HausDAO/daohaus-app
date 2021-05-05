import { MINION_TYPES } from './proposalUtils';

const orderDaosByNetwork = (userHubDaos, userNetwork) => ({
  currentNetwork: userHubDaos.find(dao => dao.networkID === userNetwork) || [],
  otherNetworks: userHubDaos.filter(dao => dao.networkID !== userNetwork)
    ?.length
    ? [...userHubDaos.filter(dao => dao.networkID !== userNetwork)]
    : [],
});
const excludeVersionsBelow = (daos, version) =>
  daos.filter(dao => dao.meta && dao.meta.version >= version);
const excludeEmptyNetworks = networks =>
  networks.filter(network => network?.data?.length);

export const getDaosByNetwork = (userHubDaos, userNetwork, version = 2) =>
  orderDaosByNetwork(
    excludeEmptyNetworks(
      userHubDaos.map(network => ({
        ...network,
        data: excludeVersionsBelow(network.data, version),
      })),
    ),
    userNetwork,
  );

export const combineDaoDataForHub = userHubDaos => {
  return userHubDaos.reduce(
    (activities, network) => {
      network.data.forEach(dao => {
        activities.proposals = [
          ...activities.proposals,
          ...dao.moloch.proposals
            .filter(prop => prop.activityFeed.unread)
            .map(activity => {
              return { ...activity, daoData: dao.meta };
            }),
        ];
        activities.rageQuits = [
          ...activities.rageQuits,
          ...dao.moloch.rageQuits
            .filter(rage => {
              const now = new Date() / 1000 || 0;
              return +rage.createdAt >= now - 1209600;
            })
            .map(activity => {
              return { ...activity, daoData: dao.meta };
            }),
        ];
      });

      return activities;
    },
    { proposals: [], rageQuits: [] },
  );
};

export const filterDAOsByName = (network, searchTerm) => ({
  ...network,
  data: network?.data?.length
    ? network.data.filter(dao =>
        dao.meta.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [],
});

export const getActiveMembers = members =>
  members.filter(member => +member.shares > 0 || +member.loot > 0);

export const hasMinion = (minions, minionType) => {
  if (Object.values(MINION_TYPES).includes(minionType)) {
    const filteredMinions = minions?.filter(
      minion => minion.minionType === minionType,
    );
    return filteredMinions?.length > 0;
  }
  return false;
};
