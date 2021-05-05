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
import { rgba } from 'polished';

import StakeProposalForm from '../forms/daoToDaoStakeProposal';
import DelegateProposalForm from '../forms/daoToDaoDelegateProposal';
import RageQuitProposalForm from '../forms/daoToDaoRageQuitProposal';
import WithdrawPullForm from '../forms/daoToDaoWithdrawPull';
// import DistributeRewardsProposalForm from '../forms/daoToDaoDistributeRewardsProposal';
import { useCustomTheme } from '../contexts/CustomThemeContext';
import { useOverlay } from '../contexts/OverlayContext';

const getModalWidth = proposalType => {
  if (proposalType === 'd2dRageQuit') {
    return '400px';
  }
  if (proposalType === 'd2dWithdraw') {
    return ['400px', null, null, '900px'];
  }
  return '700px';
};

const DaoToDaoProposalFormModal = ({
  proposalType,
  isOpen,
  returnRoute,
  daoMembers,
  uberMembers,
  uberHausMinion,
  uberDelegate,
  uberOverview,
  refetchAllies,
}) => {
  const [, setLoading] = useState(false);
  const [proposalForm, setProposalForm] = useState(null);
  const history = useHistory();
  const { theme } = useCustomTheme();
  const { setD2dProposalModal } = useOverlay();

  const daoToDaoProposalForms = {
    d2dStake: {
      type: 'New Uber Quest',
      heading: 'Stake in UBERhaus',
      subline: "Submit your DAO's membership proposal here.",
      form: <StakeProposalForm />,
    },
    // d2dVote: {
    //   type: `New Uber Quest`,
    //   heading: `Vote on proposals in UBERhaus`,
    //   subline: `Submit a vote to UBERhaus an proposal.`,
    //   form: <VoteProposalForm />,
    // },
    d2dDelegate: {
      type: 'New Uber Proposal',
      heading: 'Choose Champion',
      subline: 'Manage your delegate to UBERhaus',
      form: (
        <DelegateProposalForm
          daoMembers={daoMembers}
          uberMembers={uberMembers}
          uberHausMinion={uberHausMinion}
          uberDelegate={uberDelegate}
          refetchAllies={refetchAllies}
        />
      ),
    },
    d2dRageQuit: {
      type: 'New Uber Proposal',
      heading: 'RageQuit',
      subline: 'Submit a proposal to RageQuit from UberHaus',
      form: (
        <RageQuitProposalForm
          uberHausMinion={uberHausMinion}
          uberMembers={uberMembers}
          refetchAllies={refetchAllies}
        />
      ),
    },
    // d2dDistroRewards: {
    //   type: `New Uber Proposal`,
    //   heading: `Trigger $HAUS Distro`,
    //   subline: `Get DAO Rewards from UBERhaus`,
    //   form: <DistributeRewardsProposalForm />,
    // },
    d2dWithdraw: {
      type: 'New Uber Proposal',
      heading: '',
      subline: '',
      form: (
        <WithdrawPullForm
          uberMembers={uberMembers}
          uberHausMinion={uberHausMinion}
          uberDelegate={uberDelegate}
          uberOverview={uberOverview}
          refetchAllies={refetchAllies}
        />
      ),
    },
  };
  // console.log(uberHausMinion);

  useEffect(() => {
    if (proposalType) {
      setProposalForm(daoToDaoProposalForms[proposalType]);
    }
  }, [proposalType, uberMembers, uberHausMinion, uberDelegate, uberOverview]);

  const handleClose = () => {
    setLoading(false);
    setD2dProposalModal(prevState => !prevState);
    if (returnRoute) {
      history.push(returnRoute);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeOnOverlayClick={false}
      isCentered
    >
      <ModalOverlay
        bgColor={rgba(theme.colors.background[500], 0.8)}
        style={{ backdropFilter: 'blur(6px)' }}
      />
      {proposalForm && (
        <ModalContent
          rounded='lg'
          bg='blackAlpha.600'
          borderWidth='1px'
          borderColor='whiteAlpha.200'
          maxWidth={getModalWidth(proposalType)}
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

          <ModalFooter />
        </ModalContent>
      )}
    </Modal>
  );
};

export default DaoToDaoProposalFormModal;
