import { Flex, Spinner, Box } from '@chakra-ui/core';
import React from 'react';
import DaoActivityFeed from '../../components/Dao/DaoActivityFeed';
import DaoOverviewDetails from '../../components/Dao/DaoOverviewDetails';
import MemberInfoCard from '../../components/Dao/MemberInfoCard';

import { useDao, useUser } from '../../contexts/PokemolContext';

const Dao = () => {
  const [dao] = useDao();
  const [user] = useUser();

  return (
    <>
      {!dao ? (
        <Spinner />
      ) : (
        <>
          {user ? (
            <Flex>
              <Box w='50%' mr={6}>
                <DaoOverviewDetails dao={dao} />
              </Box>
              <Box w='40%'>
                <MemberInfoCard user={user} />
                {dao.graphData && <DaoActivityFeed dao={dao} />}
              </Box>
            </Flex>
          ) : (
            <Flex h='100%' justify='center' align='center'>
              <Box w='50%'>
                <DaoOverviewDetails dao={dao} />
              </Box>
            </Flex>
          )}
        </>
      )}
    </>
  );
};

export default Dao;
