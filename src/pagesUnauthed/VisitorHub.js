import React from "react";
import styled from "styled-components";

import NewsFeed from "../components/newsFeed";
import NetworkList from "../components/networkList";
import { DisplayLg } from "../styles/typography";
import { Divider } from "../components/staticElements";
import Layout from "../components/layout";

const VisitorHubPage = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: minmax(28rem, 40rem) 12rem minmax(36rem, auto);
  grid-template-rows: 8.4rem auto;
  .title-section {
    height: 100%;
    h2 {
      margin-bottom: 2.4rem;
    }
    grid-row: 1;
    grid-column: 1/5;
  }
`;

const VisitorHub = () => {
  return (
    <Layout>
      <VisitorHubPage>
        <DisplayLg>Not Logged In</DisplayLg>
      </VisitorHubPage>
    </Layout>
  );
};

export default VisitorHub;
