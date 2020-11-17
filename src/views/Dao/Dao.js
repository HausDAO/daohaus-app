import { Flex, Spinner, Box } from '@chakra-ui/core';
import React, { useEffect, useState } from 'react';
import DaoActivityFeed from '../../components/Dao/DaoActivityFeed';
import DaoOverviewDetails from '../../components/Dao/DaoOverviewDetails';
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
        <Box p={6}>
          {user && isMember ? (
            <Flex wrap='wrap'>
              <Box
                pr={[0, null, null, null, 6]}
                w={['100%', null, null, null, '50%']}
              >
                <DaoOverviewDetails dao={dao} />
              </Box>

              <Box w={['100%', null, null, null, '50%']} pt={[6, 0]}>
                <MemberInfoCard user={user} />
                {dao.graphData && (
                  <Box mt={6}>
                    <DaoActivityFeed />
                  </Box>
                )}
              </Box>
            </Flex>
          ) : (
            <Flex h='100%' justify='center' align='center'>
              <Box w='50%'>
                <DaoOverviewDetails dao={dao} />
              </Box>
            </Flex>
          )}
        </Box>
      )}
    </>
  );
};

export default Dao;
