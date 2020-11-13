import { Flex, Spinner, Box } from '@chakra-ui/core';
import React, { useEffect, useState } from 'react';
import DaoActivityFeed from '../../components/Dao/DaoActivityFeed';
import DaoOverviewDetails from '../../components/Dao/DaoOverviewDetails';
import BigText from '../../components/Shared/BigText';
import MemberInfoCard from '../../components/Shared/MemberInfoCard/MemberInfoCard';

import {
  useDao,
  useUser,
  useMemberWallet,
} from '../../contexts/PokemolContext';

const Dao = () => {
  const [dao] = useDao();
  const [user] = useUser();
  const [memberWallet] = useMemberWallet();
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    if (memberWallet) {
      setIsMember(memberWallet.activeMember);
    }
  }, [memberWallet]);

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
                {dao.graphData && <DaoActivityFeed />}
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
