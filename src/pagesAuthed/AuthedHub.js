import React, { useEffect } from "react";

import NewsFeed from "../components/newsFeed";
import NetworkList from "../components/networkList";
import Layout from "../components/layout";
import { useCustomTheme } from "../contexts/CustomThemeContext";

const AuthedHub = () => {
  const { theme, resetTheme } = useCustomTheme();

  useEffect(() => {
    if (theme.active) {
      resetTheme();
    }
  }, [theme, resetTheme]);
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
