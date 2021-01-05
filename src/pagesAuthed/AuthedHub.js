import React from "react";
import styled from "styled-components";

import NewsFeed from "../components/newsFeed";
import NetworkList from "../components/networkList";
import { DisplayLg } from "../styles/typography";
import { Divider, SplitLayout } from "../components/staticElements";
import Layout from "../components/layout";

const AuthedHub = () => {
  return (
    <Layout>
      <SplitLayout>
        <div className="title-section">
          <DisplayLg>Hub</DisplayLg>
          <Divider className="hard" />
        </div>
        <NetworkList />
        <NewsFeed />
      </SplitLayout>
    </Layout>
  );
};

export default AuthedHub;
