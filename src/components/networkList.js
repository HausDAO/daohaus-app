import React from "react";
import styled from "styled-components";

import NetworkDaoList from "../components/NetworkDaoList";
import { HeaderLg, Overline } from "../styles/typography";
import { ListItemCard, Divider } from "./staticElements";

import { useLocalUserData } from "../contexts/UserContext";
import { useInjectedProvider } from "../contexts/InjectedProviderContext";

const StyledNetworkList = styled.ul`
  list-style: none;
  grid-column: 1;
  grid-row: 2/3;
  .network-header {
    margin-top: 1.6rem;
    margin-bottom: 0.8rem;
  }
`;

const NetworkList = () => {
  const { userHubDaos } = useLocalUserData();
  const {
    injectedProvider: { provider },
  } = useInjectedProvider();

  const currentNetwork = userHubDaos.find(
    (dao) => dao.networkID === provider.chainId
  );
  const otherNetworks = userHubDaos.filter(
    (dao) => dao.networkID !== provider.chainId
  );

  return (
    <StyledNetworkList>
      {currentNetwork && (
        <>
          <HeaderLg className="network-header">Current Network: </HeaderLg>
          <ListItemCard>
            <Overline className="label">{currentNetwork.name}</Overline>
            <NetworkDaoList
              data={currentNetwork.data}
              networkID={currentNetwork.networkID}
            />
          </ListItemCard>
          <Divider />
        </>
      )}
      {otherNetworks.length > 0 && (
        <>
          <HeaderLg className="network-header">Other Networks: </HeaderLg>
          {otherNetworks.map((network) => {
            if (network.data.membersHub.length) {
              return (
                <ListItemCard key={network.networkID}>
                  <Overline className="label">{network.name}</Overline>
                  <NetworkDaoList
                    data={network.data}
                    networkID={network.networkID}
                  />
                </ListItemCard>
              );
            } else {
              return null;
            }
          })}
          <Divider />
        </>
      )}
    </StyledNetworkList>
  );
};

export default NetworkList;
