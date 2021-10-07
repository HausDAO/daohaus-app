import React, { useEffect, useState, useContext } from 'react';

import { CustomThemeContext } from '../contexts/CustomThemeContext';
import { ExploreContext } from '../contexts/ExploreContext';
import ExploreFilters from '../components/exploreFilters';
import ExploreList from '../components/exploreList';
import Layout from '../components/layout';
import Loading from '../components/loading';
import MainViewLayout from '../components/mainViewLayout';

const Explore = () => {
  const { theme, resetTheme } = useContext(CustomThemeContext);
  const { hasLoadedExploreData } = useContext(ExploreContext);
  const [daoCount, setDaoCount] = useState(0);

  useEffect(() => {
    if (theme.active) {
      resetTheme();
    }
  }, [theme, resetTheme]);

  return (
    <Layout>
      <MainViewLayout header='Explore DAOs'>
        {hasLoadedExploreData ? (
          <>
            <ExploreFilters daoCount={daoCount} />
            <ExploreList handleDaoCalculate={setDaoCount} />
          </>
        ) : (
          <Loading message='Fetching DAOs...' />
        )}
      </MainViewLayout>
    </Layout>
  );
};

export default Explore;
