import React, { useEffect, useState } from 'react';
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

import MemberProposalForm from '../forms/memberProposal';
import FundingProposalForm from '../forms/fundingProposal';
import WhitelistProposalForm from '../forms/whitelistProposal';
import GuildKickProposalForm from '../forms/guildKickProposal';
import TradeProposalForm from '../forms/tradeProposal';
import MinionSimpleProposalForm from '../forms/minionSimpleProposal';
import SuperfluidMinionProposalForm from '../forms/superfluidMinionProposal';
import TransmutationProposal from '../forms/transmutationProposal';
import { getTerm } from '../utils/metadata';
import { useMetaData } from '../contexts/MetaDataContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useCustomTheme } from '../contexts/CustomThemeContext';
import LootGrabForm from '../forms/lootGrab';

const ProposalFormModal = ({ proposalType }) => {
  const [, setLoading] = useState(false);
  const [proposalForm, setProposalForm] = useState(null);
  const { customTerms } = useMetaData();
  const { theme } = useCustomTheme();
  const { proposalModal, setProposalModal } = useOverlay();

  const proposalForms = {
    member: {
      type: `New ${getTerm(customTerms, 'proposal')}`,
      heading: `New ${getTerm(customTerms, 'member')} ${getTerm(
        customTerms,
        'proposal',
      )}`,
      subline: 'Submit your membership proposal here.',
      form: <MemberProposalForm />,
    },
    funding: {
      type: `New ${getTerm(customTerms, 'proposal')}`,
      heading: `New Funding ${getTerm(customTerms, 'proposal')}`,
      subline: 'Submit a funding proposal here.',
      form: <FundingProposalForm />,
    },
    lootgrab: {
      type: `New ${getTerm(customTerms, 'proposal')}`,
      heading: `New Loot Grab ${getTerm(customTerms, 'proposal')}`,
      subline: 'Submit a loot grab proposal here.',
      form: <LootGrabForm />,
    },
    whitelist: {
      type: `New ${getTerm(customTerms, 'proposal')}`,
      heading: `New Whitelist ${getTerm(customTerms, 'proposal')}`,
      subline: 'Whitelist a token here.',
      form: <WhitelistProposalForm />,
    },
    guildkick: {
      type: `New ${getTerm(customTerms, 'proposal')}`,
      heading: `New GuildKick ${getTerm(customTerms, 'proposal')}`,
      subline: 'Kick a perpetrator here.',
      form: <GuildKickProposalForm />,
    },
    trade: {
      type: `New ${getTerm(customTerms, 'proposal')}`,
      heading: `New Trade ${getTerm(customTerms, 'proposal')}`,
      subline: 'Submit a trade proposal here.',
      form: <TradeProposalForm />,
    },
    minion: {
      type: `New ${getTerm(customTerms, 'proposal')}`,
      heading: `New Minion ${getTerm(customTerms, 'proposal')}`,
      subline: 'Submit a Minion proposal here.',
      form: <MinionSimpleProposalForm />,
    },
    superfluidMinion: {
      type: `New ${getTerm(customTerms, 'proposal')}`,
      heading: `New Superfluid Minion ${getTerm(customTerms, 'proposal')}`,
      subline: 'Submit a Superfluid Minion proposal here.',
      form: <SuperfluidMinionProposalForm />,
    },
    transmutation: {
      type: `New ${getTerm(customTerms, 'proposal')}`,
      heading: `New Transmutation ${getTerm(customTerms, 'proposal')}`,
      subline: 'Submit a Transmutation proposal here.',
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
    <Modal
      isOpen={proposalModal}
      onClose={handleClose}
      closeOnOverlayClick={false}
      isCentered
    >
      <ModalOverlay
        bgColor={rgba(theme.colors.background[500], 0.8)}
        style={{ backdropFilter: 'blur(6px)' }}
      />
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

        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};

export default ProposalFormModal;
