import { Flex, Spinner, Box } from '@chakra-ui/core';
import React, { useEffect, useState } from 'react';
import DaoActivityFeed from '../../components/Dao/DaoActivityFeed';
import DaoOverviewDetails from '../../components/Dao/DaoOverviewDetails';
import MemberInfoCard from '../../components/Dao/MemberInfoCard';

import { useDao, useUser, useMembers } from '../../contexts/PokemolContext';

const Dao = () => {
  const [dao] = useDao();
  const [user] = useUser();
  const [members] = useMembers();
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    if (user && members) {
      // TODO can this be done as a utility accessible on user.isMember(?) or just a separate utility that takes isMember(user, members) ?
      members.forEach((member) => {
        if (
          user.username.toLowerCase() === member.memberAddress.toLowerCase()
        ) {
          setIsMember(true);
        }
      });
    }
  }, [user, members, setIsMember]);

  return (
    <>
      {!dao ? (
        <Spinner />
      ) : (
        <>
          {user && isMember ? (
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
