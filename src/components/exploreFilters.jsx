import React, { useContext, useEffect, useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';

import ExploreSearch from './exploreSearch';
import ExploreTagList from './exploreTagList';
import ExploreFilterList from './exploreFilterList';
import { ExploreContext } from '../contexts/ExploreContext';
import ListSort from './listSort';
import { SORT_OPTIONS } from '../utils/exploreContent';

const ExploreFilters = ({ daoCount }) => {
  const [sort, setSort] = useState();
  const { dispatch } = useContext(ExploreContext);

  useEffect(() => {
    if (sort) {
      dispatch({ type: 'updateSort', payload: sort });
    }
  }, [sort]);

  return (
    <>
      <Flex align='center' justify='flex-start' wrap='wrap' ml={5}>
        <Box
          mr={5}
          textTransform='uppercase'
          fontFamily='heading'
          fontSize={['sm', null, null, 'md']}
        >
          {daoCount} DAOS
        </Box>
        <ExploreSearch />
        <Box mr={6}>
          <ListSort sort={sort} setSort={setSort} options={SORT_OPTIONS} />
        </Box>
        <ExploreFilterList />
      </Flex>

      <ExploreTagList />
    </>
  );
};

export default ExploreFilters;
