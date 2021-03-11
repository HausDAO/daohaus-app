import React, { useState } from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';

import Following from '../components/followingDaos';
import MainViewLayout from '../components/mainViewLayout';
import DaoToDaoManager from '../components/daoToDaoManager';
import DaoToDaoProposalModal from '../modals/daoToDaoProposalModal';
import DaoToDaoProposalTypeModal from '../modals/daoToDaoProposalTypeModal';
import { useOverlay } from '../contexts/OverlayContext';
import GenericModal from '../modals/genericModal';
import NewUberHausMinion from '../forms/newUberHausMinion';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';

const Allies = ({ daoOverview, daoMetaData }) => {
  const { d2dProposalModal } = useOverlay();
  const [proposalType, setProposalType] = useState(null);
  const { address, requestWallet } = useInjectedProvider();

  if (!address) {
    return (
      <Box
        rounded='lg'
        bg='blackAlpha.600'
        borderWidth='1px'
        borderColor='whiteAlpha.200'
        p={6}
        m={[10, 'auto', 0, 'auto']}
        w='50%'
        textAlign='center'
      >
        <Box fontSize='3xl' fontFamily='heading' fontWeight={700} mb={10}>
          Connect your wallet to summon a DAO.
        </Box>

        <Flex direction='column' align='center'>
          <Button onClick={requestWallet}>Connect Wallet</Button>
        </Flex>
      </Box>
    );
  }

  return (
    <MainViewLayout header='Allies'>
      <Box>
        <DaoToDaoProposalTypeModal
          isOpen={true}
          setProposalType={setProposalType}
        />
        <DaoToDaoProposalModal
          isOpen={d2dProposalModal}
          proposalType={proposalType}
        />
        <GenericModal closeOnOverlayClick={false} modalId='uberMinionLaunch'>
          <NewUberHausMinion />
        </GenericModal>
        <DaoToDaoManager
          daoOverview={daoOverview}
          daoMetaData={daoMetaData}
          setProposalType={setProposalType}
        />
        <Following />
      </Box>
    </MainViewLayout>
  );
};

export default Allies;
