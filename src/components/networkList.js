import React from "react";

import NetworkDaoList from "../components/NetworkDaoList";

import { useUser } from "../contexts/UserContext";
import { useInjectedProvider } from "../contexts/InjectedProviderContext";

const NetworkList = () => {
  const { userHubDaos } = useUser();
  const { injectedProvider } = useInjectedProvider();
  const provider = injectedProvider?.currentProvider;

  const currentNetwork = userHubDaos.find(
    (dao) => dao.networkID === provider?.chainId
  );
  const otherNetworks = userHubDaos.filter(
    (dao) => dao.networkID !== provider?.chainId
  );

  return (
    <div>
      {currentNetwork && (
        <>
          <h3 className="network-header">Current Network: </h3>
          <p className="label">{currentNetwork.name}</p>
          <NetworkDaoList
            data={currentNetwork.data}
            networkID={currentNetwork.networkID}
          />
        </>
      )}
      {otherNetworks.length > 0 && (
        <>
          <h3 className="network-header">Other Networks: </h3>
          {otherNetworks.map((network) => {
            if (network.data.length) {
              return (
                <div key={network.networkID}>
                  <p className="label">{network.name}</p>
                  <NetworkDaoList
                    data={network.data}
                    networkID={network.networkID}
                  />
                </div>
              );
            } else {
              return null;
            }
          })}
        </>
      )}
    </div>
  );
};

export default NetworkList;
