import React, { useContext, useMemo } from 'react';
import { Input } from '@chakra-ui/react';

import { ExploreContext } from '../contexts/ExploreContext';
import { debounce } from '../utils/debounce';

const ExploreSearch = () => {
  const { dispatch } = useContext(ExploreContext);

  const handleChange = event => {
    const searchTerm = event.target.value;
    if (searchTerm) {
      dispatch({
        type: 'setSearchTerm',
        payload: searchTerm.toLowerCase(),
      });
    } else {
      dispatch({ type: 'clearSearchTerm' });
    }
  };

  const debouncedHandleChange = useMemo(() => debounce(handleChange, 400), []);

  return (
    <Input
      maxW='250px'
      mr={6}
      type='search'
      className='input'
      placeholder='Search Daos'
      onChange={debouncedHandleChange}
    />
  );
};

export default ExploreSearch;
