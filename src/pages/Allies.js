import React, { useState } from 'react';
import { Box } from '@chakra-ui/react';

import Following from '../components/followingDaos';
import MainViewLayout from '../components/mainViewLayout';
import DaoToDaoManager from '../components/daoToDaoManager';
import DaoToDaoProposalModal from '../modals/daoToDaoProposalModal';
import DaoToDaoProposalTypeModal from '../modals/daoToDaoProposalTypeModal';
import { useOverlay } from '../contexts/OverlayContext';

const Allies = () => {
  const { d2dProposalModal } = useOverlay();
  const [proposalType, setProposalType] = useState(null);

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
        <Following />
        <DaoToDaoManager />
      </Box>
    </MainViewLayout>
  );
};

export default Allies;
