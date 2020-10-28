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
        <div>
          {dao.graphData ? (
            <Flex>
              <Box w='50%' mr={6}>
                <DaoOverviewDetails dao={dao} />
              </Box>
              {user ? (
                <Box w='40%'>
                  <MemberInfoCard user={user} />
                  <DaoActivityFeed dao={dao} />
                </Box>
              ) : null}
            </Flex>
          ) : null}
        </div>
      )}
    </>
  );
};

export default Dao;
