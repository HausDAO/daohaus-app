import React from 'react';
import { Box } from '@chakra-ui/react';
// import { useModals } from '../../contexts/PokemolContext';
import Following from '../components/followingDaos';
import MainViewLayout from '../components/mainViewLayout';
// import DaoToDaoManager from '../../components/Settings/DaoToDaoManager';
// import DaoToDaoProposalModal from '../../components/Modal/DaoToDaoProposalModal';
// import DaoToDaoProposalTypeModal from '../../components/Modal/DaoToDaoProposalTypeModal';

const Allies = () => {
  // const { modals } = useModals();

  // const [proposalType, setProposalType] = useState(null);

  return (
    <MainViewLayout header='Allies'>
      <Box pl={6}>
        {/* <DaoToDaoProposalTypeModal
        isOpen={modals.daoToDaoProposalType}
        setProposalType={setProposalType}
      /> */}
        {/* <DaoToDaoProposalModal
        isOpen={modals.daoToDaoProposal}
        proposalType={proposalType}
      /> */}
        <Following />
        {/* <DaoToDaoManager /> */}
      </Box>
    </MainViewLayout>
  );
};

export default Allies;
