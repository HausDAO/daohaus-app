import React from "react";

import NewsFeed from "../components/newsFeed";
import NetworkList from "../components/networkList";
import Layout from "../components/layout";

const AuthedHub = () => {
  return (
    <Layout>
      <div>
        <h1>Hub</h1>
      </div>
      <NetworkList />
      <NewsFeed />
    </Layout>
  );
};

export default AuthedHub;
