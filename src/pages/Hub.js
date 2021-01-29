import React, { useEffect, useContext } from 'react';

import Layout from '../components/layout';
import { CustomThemeContext } from '../contexts/CustomThemeContext';
import { defaultHubData } from '../utils/navLinks';
import Main from './Main';

const Hub = () => {
  const { theme, resetTheme } = useContext(CustomThemeContext);

  useEffect(() => {
    if (theme.active) {
      resetTheme();
    }
  }, [theme, resetTheme]);

  return (
    <Layout navLinks={defaultHubData}>
      <Main />
    </Layout>
  );
};

export default Hub;
