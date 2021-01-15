import React, { useContext } from 'react';

import { ExploreContext } from '../../contexts/ExploreContext';

const ExploreSearch = () => {
  const { dispatch } = useContext(ExploreContext);

  const handleChange = (event) => {
    if (event.target.value) {
      dispatch({
        type: 'setSearchTerm',
        payload: event.target.value.toLowerCase(),
      });
    } else {
      dispatch({ type: 'clearSearchTerm' });
    }
  };

  return (
    <div>
      <input
        type='search'
        className='input'
        placeholder='Search Daos'
        onChange={(e) => handleChange(e)}
      />
    </div>
  );
};

export default ExploreSearch;
