import React, { useContext } from 'react';
// import Select from 'react-select';

import { ExploreContext } from '../../contexts/ExploreContext';
import { SORT_OPTIONS } from '../../content/explore-content';

const ExploreSort = () => {
  const { state, dispatch } = useContext(ExploreContext);

  const handleChange = (option) => {
    dispatch({ type: 'updateSort', payload: option });
  };

  return (
    <div>
      sort
      {/* <Select
        value={state.sort}
        onChange={option => handleChange(option)}
        options={SORT_OPTIONS}
        className="ReactSelectContainer"
        classNamePrefix="ReactSelect"
      /> */}
    </div>
  );
};

export default ExploreSort;
