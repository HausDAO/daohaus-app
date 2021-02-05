import React, { useContext, useEffect, useState } from 'react';
import { Flex } from '@chakra-ui/react';

import ExploreSearch from './exploreSearch';
import ExploreTagList from './exploreTagList';
import ExploreFilterList from './exploreFilterList';
import { ExploreContext } from '../contexts/ExploreContext';
import ListSort from './listSort';
import { SORT_OPTIONS } from '../utils/exploreContent';

const ExploreFilters = () => {
  const [sort, setSort] = useState();
  const { dispatch } = useContext(ExploreContext);

  useEffect(() => {
    if (sort) {
      dispatch({ type: 'updateSort', payload: sort });
    }
  }, [sort]);

  return (
    <>
      <Flex align='center' justify='flex-start' wrap='wrap'>
        <ExploreSearch />
        <ListSort sort={sort} setSort={setSort} options={SORT_OPTIONS} />
        <ExploreFilterList />
      </Flex>

      <ExploreTagList />
    </>
  );
};

export default ExploreFilters;
