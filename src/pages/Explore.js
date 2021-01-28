import React from 'react';
import Layout from '../components/layout';
import { ExploreContextProvider } from '../contexts/ExploreContext';

const Explore = () => {
  return (
    <ExploreContextProvider>
      <Layout>Explore!</Layout>
    </ExploreContextProvider>
  );
};

export default Explore;
