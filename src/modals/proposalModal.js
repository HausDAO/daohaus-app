import React, { useEffect, useState } from 'react';
// import { useHistory } from 'react-router-dom';
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
import MemberProposalForm from '../forms/memberProposal';
import FundingProposalForm from '../forms/fundingProposal';
import WhitelistProposalForm from '../forms/whitelistProposal';
import GuildKickProposalForm from '../forms/guildKickProposal';
import TradeProposalForm from '../forms/tradeProposal';
import MinionSimpleProposalForm from '../forms/minionSimpleProposal';
import TransmutationProposal from '../forms/transmutationProposal';
import { getCopy } from '../utils/metadata';
import { useMetaData } from '../contexts/MetaDataContext';
import { useOverlay } from '../contexts/OverlayContext';

const ProposalFormModal = ({ proposalType, returnRoute }) => {
  const [, setLoading] = useState(false);
  const [proposalForm, setProposalForm] = useState(null);
  const { customTerms } = useMetaData();
  // const history = useHistory();
  const { proposalModal, setProposalModal } = useOverlay();

  const proposalForms = {
    member: {
      type: `New ${getCopy(customTerms, 'proposal')}`,
      heading: `New ${getCopy(customTerms, 'member')} ${getCopy(
        customTerms,
        'proposal',
      )}`,
      subline: `Submit your membership proposal here.`,
      form: <MemberProposalForm />,
    },
    funding: {
      type: `New ${getCopy(customTerms, 'proposal')}`,
      heading: `New Funding ${getCopy(customTerms, 'proposal')}`,
      subline: `Submit a funding proposal here.`,
      form: <FundingProposalForm />,
    },
    whitelist: {
      type: `New ${getCopy(customTerms, 'proposal')}`,
      heading: `New Whitelist ${getCopy(customTerms, 'proposal')}`,
      subline: `Whitelist a token here.`,
      form: <WhitelistProposalForm />,
    },
    guildkick: {
      type: `New ${getCopy(customTerms, 'proposal')}`,
      heading: `New GuildKick ${getCopy(customTerms, 'proposal')}`,
      subline: `Kick a perpetrator here.`,
      form: <GuildKickProposalForm />,
    },
    trade: {
      type: `New ${getCopy(customTerms, 'proposal')}`,
      heading: `New Trade ${getCopy(customTerms, 'proposal')}`,
      subline: `Submit a trade proposal here.`,
      form: <TradeProposalForm />,
    },
    minion: {
      type: `New ${getCopy(customTerms, 'proposal')}`,
      heading: `New Minion ${getCopy(customTerms, 'proposal')}`,
      subline: `Submit a Minion proposal here.`,
      form: <MinionSimpleProposalForm />,
    },
    transmutation: {
      type: `New ${getCopy(customTerms, 'proposal')}`,
      heading: `New Transmutation ${getCopy(customTerms, 'proposal')}`,
      subline: `Submit a Transmutation proposal here.`,
      form: <TransmutationProposal />,
    },
  };

  useEffect(() => {
    if (proposalType) {
      setProposalForm(proposalForms[proposalType]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposalType]);

  const handleClose = () => {
    setLoading(false);
    setProposalModal(false);
    // if (returnRoute) {
    //   history.push(returnRoute);
    // }
  };

  return (
    <Modal isOpen={proposalModal} onClose={handleClose} isCentered>
      <ModalOverlay bgColor='background.400' />
      <ModalContent
        rounded='lg'
        bg='blackAlpha.600'
        borderWidth='1px'
        borderColor='whiteAlpha.200'
        maxWidth='800px'
      >
        <ModalHeader>
          <Box
            fontFamily='heading'
            textTransform='uppercase'
            fontSize='xs'
            fontWeight={700}
            color='#7579C5'
            mb={4}
          >
            {proposalForm?.heading}
          </Box>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* <Box color='#C4C4C4' mb={6}>
              {proposalForm.subline}
            </Box> */}
          {proposalForm?.form}
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProposalFormModal;
