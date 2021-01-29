const orderDaosByNetwork = (userHubDaos, userNetwork) => ({
  currentNetwork:
    userHubDaos.find((dao) => dao.networkID === userNetwork) || null,
  otherNetworks: userHubDaos.filter((dao) => dao.networkID !== userNetwork)
    ?.length
    ? [...userHubDaos.filter((dao) => dao.networkID !== userNetwork)]
    : null,
});
const excludeVersionsBelow = (daos, version) =>
  daos.filter((dao) => dao.meta.version >= version);
const excludeEmptyNetworks = (networks) =>
  networks.filter((network) => network?.data?.length);

export const getDaosByNetwork = (userHubDaos, userNetwork, version = 2) =>
  orderDaosByNetwork(
    excludeEmptyNetworks(
      userHubDaos.map((network) => ({
        ...network,
        data: excludeVersionsBelow(network.data, version),
      })),
    ),
    userNetwork,
  );
