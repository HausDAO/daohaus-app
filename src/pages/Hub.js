import React, { useEffect, useContext } from 'react';

import Layout from '../components/layout';
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
