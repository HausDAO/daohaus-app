import React from "react";
import ApolloClient from "apollo-boost";
import styled from "styled-components";

import NetworkDaoList from "../components/NetworkDaoList";
import { useInjectedProvider } from "../contexts/InjectedProviderContext";
import { supportedChains } from "../utils/chain";
import { Overline } from "../styles/typography";
import { ListItemCard, Divider } from "./staticElements";

import { getColor } from "../styles/palette";
import { useLocalUserData } from "../contexts/UserContext";

const StyledNetworkList = styled.ul`
  list-style: none;
  grid-column: 1;
  grid-row: 2/3;
`;

const NetworkList = ({ provider }) => {
  const { userHubDaos } = useLocalUserData();

  return (
    <StyledNetworkList>
      {userHubDaos.map((network) => {
        if (network.data.membersHub.length) {
          return (
            <ListItemCard key={network.networkID}>
              <Overline className="label">{network.name}</Overline>
              <NetworkDaoList
                selectedAddress={provider.selectedAddress}
                name={network.name}
                data={network.data}
              />
            </ListItemCard>
          );
        }
      })}
    </StyledNetworkList>
  );
};

export default NetworkList;
