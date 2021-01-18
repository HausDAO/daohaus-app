import React from 'react';
import { Flex } from '@chakra-ui/react';

import ExploreFilterList from './ExploreFilterList';
import ExploreSearch from './ExploreSearch';
import ExploreSort from './ExploreSort';
import ExploreTagList from './ExploreTagList';

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
