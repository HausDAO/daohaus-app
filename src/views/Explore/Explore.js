import React, { useState } from 'react';
import { Box, Flex, Spinner } from '@chakra-ui/react';
import ExploreGraphInit from '../../contexts/ExploreGraphInit';

const Explore = () => {
  const [daos, setDaos] = useState();

  console.log('daos', daos);

  return (
    <Box p={6}>
      <ExploreGraphInit daos={daos} setDaos={setDaos} />
    </Box>
  );
};

export default Explore;
