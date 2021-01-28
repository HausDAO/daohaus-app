import React from 'react';
import { Flex } from '@chakra-ui/react';

import ExploreSearch from './exploreSearch';
import ExploreSort from './exploreSort';
import ExploreTagList from './exploreTagList';
import ExploreFilterList from './exploreFilterList';

const ExploreFilters = () => {
  return (
    <>
      <Flex align='center' justify='flex-start' wrap='wrap'>
        <ExploreSearch />
        <ExploreSort />
        <ExploreFilterList />
      </Flex>

      <ExploreTagList />
    </>
  );
};

export default ExploreFilters;
