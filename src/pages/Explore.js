import React, { useContext } from 'react';
import { Spinner } from '@chakra-ui/react';
import ExploreFilters from '../components/exploreFilters';
import ExploreList from '../components/exploreList';
import Layout from '../components/layout';
import { ExploreContext } from '../contexts/ExploreContext';
import MainViewLayout from '../components/mainViewLayout';

const Explore = () => {
  const { hasLoadedExploreData } = useContext(ExploreContext);

  return (
    <Layout>
      <MainViewLayout header='Explore DAOs'>
        {hasLoadedExploreData ? (
          <>
            <ExploreFilters />
            <ExploreList />
          </>
        ) : (
          <Spinner />
        )}
      </MainViewLayout>
    </Layout>
  );
};

export default Explore;
