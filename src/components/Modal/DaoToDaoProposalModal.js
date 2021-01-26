import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalOverlay,
  Box,
} from '@chakra-ui/react';

// import { useTheme } from '../../contexts/CustomThemeContext';
import StakeProposalForm from '../Forms/DaoToDaoProposals/StakeProposal';
import DelegateProposalForm from '../Forms/DaoToDaoProposals/DelegateProposal';
import RageQuitProposalForm from '../Forms/DaoToDaoProposals/RageQuitProposal';
import DistributeRewardsProposalForm from '../Forms/DaoToDaoProposals/DistributeRewardsProposal';
// import VoteProposalForm from '../Forms/Proposals/TradeProposal';
import { useModals } from '../../contexts/PokemolContext';

const DaoToDaoProposalFormModal = ({ proposalType, isOpen, returnRoute }) => {
  const [, setLoading] = useState(false);
  const [proposalForm, setProposalForm] = useState(null);
  // const [theme] = useTheme();
  const history = useHistory();
  const { closeModals } = useModals();

  const daoToDaoProposalForms = {
    d2dStake: {
      type: `New Uber Quest`,
      heading: `Stake in UBERhaus`,
      subline: `Submit your DAO's membership proposal here.`,
      form: <StakeProposalForm />,
    },
    // d2dVote: {
    //   type: `New Uber Quest`,
    //   heading: `Vote on proposals in UBERhaus`,
    //   subline: `Submit a vote to UBERhaus an proosal.`,
    //   form: <VoteProposalForm />,
    // },
    d2dDelegate: {
      type: `New Uber Quest`,
      heading: `Choose Champion`,
      subline: `Manage your delegate to UBERhaus`,
      form: <DelegateProposalForm />,
    },
    d2dRageQuit: {
      type: `New Uber Quest`,
      heading: `RageQuit $HAUS`,
      subline: `RageQuit your stake from UBERhaus`,
      form: <RageQuitProposalForm />,
    },
    d2dDistroRewards: {
      type: `New Uber Quest`,
      heading: `Trigger $HAUS Distro`,
      subline: `Get DAO Rewards from UBERhaus`,
      form: <DistributeRewardsProposalForm />,
    },
  };

  // {
  //   name: 'Stake',
  //   subhead: 'Have your DAO join UBERhaus',
  //   proposalType: 'd2dStake',
  //   image: 'themes/raidTheme/raidguild__swords-white.svg',
  //   show: true,
  // },
  // {
  //   name: 'Vote',
  //   subhead: 'Vote on proposals in UberHaus',
  //   proposalType: 'd2dVote',
  //   image: 'themes/raidTheme/raidguild__swords-white.svg',
  //   show: true,
  // },
  // {
  //   name: 'Delegate',
  //   subhead: "Manage your DAO's delegate",
  //   proposalType: 'd2dDelegate',
  //   image: 'themes/raidTheme/raidguild__swords-white.svg',
  //   show: true,
  // },
  // {
  //   name: 'Rage Quit',
  //   subhead: 'Rage Quit your stake from UBERhaus',
  //   proposalType: 'd2dRageQuit',
  //   image: 'themes/raidTheme/raidguild__swords-white.svg',
  //   show: true,
  // },
  // {
  //   name: 'Distro Rewards',
  //   subhead: 'Get DAO Rewards from UBERhaus',
  //   proposalType: 'd2dDistroRewards',
  //   image: 'themes/raidTheme/raidguild__swords-white.svg',
  //   show: true,
  // },

  useEffect(() => {
    if (proposalType) {
      setProposalForm(daoToDaoProposalForms[proposalType]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposalType]);

  const handleClose = () => {
    setLoading(false);
    closeModals();
    if (returnRoute) {
      history.push(returnRoute);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      {proposalForm && (
        <ModalContent
          rounded='lg'
          bg='blackAlpha.600'
          borderWidth='1px'
          borderColor='whiteAlpha.200'
          maxWidth='700px'
        >
          <ModalHeader>
            <Box
              fontFamily='heading'
              textTransform='uppercase'
              fontSize='xs'
              fontWeight={700}
              color='#7579C5'
            >
              {proposalForm.type}
            </Box>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              color='#C4C4C4'
              mb={2}
              fontFamily='heading'
              fontWeight={900}
              fontSize='2xl'
            >
              {proposalForm.heading}
            </Box>
            <Box color='#C4C4C4' mb={4}>
              {proposalForm.subline}
            </Box>
            {proposalForm.form}
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      )}
    </Modal>
  );
};

export default DaoToDaoProposalFormModal;
