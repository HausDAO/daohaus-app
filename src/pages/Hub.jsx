import React, { useEffect, useContext } from 'react';

import { CustomThemeContext } from '../contexts/CustomThemeContext';
import HubAccountModal from '../modals/hubAccountModal';
import Layout from '../components/layout';
import Main from './Main';
import { defaultHubData } from '../utils/navLinks';

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
