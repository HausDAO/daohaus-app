import React from "react";
import styled from "styled-components";

import { DisplayLg } from "../styles/typography";
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
