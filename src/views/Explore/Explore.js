import React, { useContext, useEffect, useState } from 'react';
import { Box, Flex, Spinner } from '@chakra-ui/react';

import ExploreGraphInit from '../../contexts/ExploreGraphInit';
import { ExploreContext } from '../../contexts/ExploreContext';
import ExploreList from '../../components/Explore/ExploreList';
import ExploreFilters from '../../components/Explore/ExploreFilters';

const Explore = () => {
  const { state, dispatch } = useContext(ExploreContext);
  const [daos, setDaos] = useState();
  const [fetchComplete, setFetchComplete] = useState();

  // useEffect(() => {
  //   dispatch({ type: 'resetExplore' });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // console.log('daos', daos);
  useEffect(() => {
    if (fetchComplete) {
      dispatch({ type: 'setAllDaos', payload: daos });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchComplete]);

  return (
    <Box p={6}>
      {state.allDaos.length ? (
        <>
          <div className='FilterBar'>{/* <ExploreFilters /> */}</div>
          <div className='View'>
            <ExploreList />
          </div>
        </>
      ) : (
        <Spinner />
      )}

      <ExploreGraphInit
        daos={daos}
        setDaos={setDaos}
        setFetchComplete={setFetchComplete}
      />
    </Box>
  );
};

export default Explore;
