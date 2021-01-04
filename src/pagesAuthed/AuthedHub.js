import React from "react";
import ApolloClient from "apollo-boost";
import styled from "styled-components";

import NetworkDaoList from "../components/NetworkDaoList";
import { useInjectedProvider } from "../contexts/InjectedProviderContext";
import { supportedChains } from "../utils/chain";
import { BodyLg, DisplayLg } from "../styles/typography";
import { ListItemCard, Divider } from "../components/staticElements";
import NewsFeed from "../components/newsFeed";

import { useLocalUserData } from "../contexts/UserContext";
import NetworkList from "../components/networkList";

const AuthedHubPage = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: minmax(32rem, 48rem) minmax(4rem, auto) minmax(
      28rem,
      36rem
    );
  grid-template-rows: 10% 90%;
  .title-section {
    height: 100%;
    h2 {
      margin-bottom: 2.4rem;
    }
    grid-row: 1;
    grid-column: 1/4;
  }
`;

const AuthedHub = ({ provider }) => {
  return (
    <AuthedHubPage>
      <div className="title-section">
        <DisplayLg>Hub</DisplayLg>
        <Divider className="hard" />
      </div>
      <NetworkList provider={provider} />
      <NewsFeed provider={provider} />
    </AuthedHubPage>
  );
};

export default AuthedHub;
