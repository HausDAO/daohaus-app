import { Flex, Box } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import DaoActivityFeed from '../../components/Dao/DaoActivityFeed';
import DaoOverviewDetails from '../../components/Dao/DaoOverviewDetails';
import NewSummonerModal from '../../components/Modal/NewSummonerModal';
import MemberInfoCard from '../../components/Shared/MemberInfoCard/MemberInfoCard';

import {
  useDao,
  useUser,
  useMemberWallet,
  useModals,
  useProposals,
} from '../../contexts/PokemolContext';

const Dao = () => {
  const [dao] = useDao();
  const [proposals] = useProposals();
  const [user] = useUser();
  const [memberWallet] = useMemberWallet();
  const [isMember, setIsMember] = useState(false);
  const { modals, openModal } = useModals();

  useEffect(() => {
    if (memberWallet) {
      setIsMember(memberWallet.activeMember);
    }
  }, [memberWallet]);

  useEffect(() => {
    if (proposals && !proposals.length) {
      // need to wait for proposals to be fully loaded
      // TODO: edge when switching from a new dao proposal page to a current dao proposal page
      // this popup still shows, proposals must be set empty on transition
      openModal('newSummonerModal');
    }
    // eslint-disable-next-line
  }, [proposals]);

  return (
    <>
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
      <NewSummonerModal isOpen={modals.newSummonerModal} />
    </>
  );
};

export default Dao;
