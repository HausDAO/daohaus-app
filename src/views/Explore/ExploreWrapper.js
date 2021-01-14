import React from 'react';
import { ExploreContextProvider } from '../../contexts/ExploreContext';
import Explore from './Explore';

const ExplorWrapper = () => {
  return (
    <ExploreContextProvider>
      <Explore />
    </ExploreContextProvider>
  );
};

export default ExplorWrapper;
