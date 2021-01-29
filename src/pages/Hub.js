import React, { useEffect, useContext } from 'react';

// import NewsFeed from '../components/newsFeed';
// import NetworkList from '../components/networkList';
import Layout from '../components/layout';
// import HubRouter from '../routers/hubRouter';
import { CustomThemeContext } from '../contexts/CustomThemeContext';
import HubAccountModal from '../modals/hubAccountModal';
import { defaultHubData } from '../utils/navLinks';
import Main from './Main';

const Hub = () => {
  const { theme, resetTheme } = useContext(CustomThemeContext);

  useEffect(() => {
    if (theme.active) {
      resetTheme();
    }
  }, [theme, resetTheme]);

  const HubScopedModals = () => (
    <>
      <HubAccountModal />
    </>
  );

  return (
    <Layout navLinks={defaultHubData}>
      <HubScopedModals />
      <Main />
    </Layout>
  );
};

export default Hub;
