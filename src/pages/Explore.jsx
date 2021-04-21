import React, { useState, useContext } from 'react';
import { Spinner } from '@chakra-ui/react';
import ExploreFilters from '../components/exploreFilters';
import ExploreList from '../components/exploreList';
import Layout from '../components/layout';
import { ExploreContext } from '../contexts/ExploreContext';
import MainViewLayout from '../components/mainViewLayout';

const Explore = () => {
  const { hasLoadedExploreData } = useContext(ExploreContext);
  const [daoCount, setDaoCount] = useState(0);

  return (
    <Layout>
      <MainViewLayout header='Explore DAOs'>
        {hasLoadedExploreData ? (
          <>
            <ExploreFilters daoCount={daoCount} />
            <ExploreList handleDaoCalculate={setDaoCount} />
          </>
        ) : (
          <Spinner />
        )}
      </MainViewLayout>
    </Layout>
  );
};

export default Explore;
