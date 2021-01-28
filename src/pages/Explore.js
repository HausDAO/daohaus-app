import React, { useContext } from 'react';
import { Spinner } from '@chakra-ui/react';
import ExploreFilters from '../components/exploreFilters';
import ExploreList from '../components/exploreList';
import Layout from '../components/layout';
import { ExploreContext } from '../contexts/ExploreContext';

const Explore = () => {
  const { hasLoadedExploreData } = useContext(ExploreContext);
  return (
    <Layout>
      {hasLoadedExploreData ? (
        <>
          <ExploreFilters />
          <ExploreList />
        </>
      ) : (
        <Spinner />
      )}
    </Layout>
  );
};

export default Explore;
