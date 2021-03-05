import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
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
import { rgba } from 'polished';

import StakeProposalForm from '../forms/daoToDaoStakeProposal';
import DelegateProposalForm from '../forms/daoToDaoDelegateProposal';
import RageQuitProposalForm from '../forms/daoToDaoRageQuitProposal';
import DistributeRewardsProposalForm from '../forms/daoToDaoDistributeRewardsProposal';
import { useCustomTheme } from '../contexts/CustomThemeContext';
import { useOverlay } from '../contexts/OverlayContext';

const DaoToDaoProposalFormModal = ({ proposalType, isOpen, returnRoute }) => {
  const [, setLoading] = useState(false);
  const [proposalForm, setProposalForm] = useState(null);
  const history = useHistory();
  const location = useLocation();
  const { theme } = useCustomTheme();
  const { setD2dProposalModal } = useOverlay();

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
    //   subline: `Submit a vote to UBERhaus an proposal.`,
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

  useEffect(() => {
    console.log('location', location);
  }, [location]);

  useEffect(() => {
    if (proposalType) {
      setProposalForm(daoToDaoProposalForms[proposalType]);
    }
  }, [proposalType]);

  const handleClose = () => {
    setLoading(false);
    setD2dProposalModal((prevState) => !prevState);
    if (returnRoute) {
      history.push(returnRoute);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay bgColor={rgba(theme.colors.background[500], 0.8)} />
      {proposalForm && (
        <ModalContent
          rounded='lg'
          bg='blackAlpha.600'
          borderWidth='1px'
          borderColor='whiteAlpha.200'
          maxWidth='700px'
          style={{ backdropFilter: 'blur(6px)' }}
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
