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

import { useMetaData } from '../contexts/MetaDataContext';
import { useOverlay } from '../contexts/OverlayContext';
import { useCustomTheme } from '../contexts/CustomThemeContext';
import FormBuilder from '../formBuilder/formBuilder';
import SuperfluidMinionProposalForm from '../forms/superfluidMinionProposal';
import TransmutationProposal from '../forms/transmutationProposal';
import NiftyProposalForm from '../forms/minionNiftyProposal';

import { getTerm } from '../utils/metadata';
import { FORM } from '../data/forms';
import MinionProposalForm from '../forms/minionSimpleProposal';

// TODO Refactor this logic with new UX
const getMaxWidth = proposalForm => {
  if (!proposalForm?.form?.props?.layout) return '800px';
  if (proposalForm?.form?.propos?.layout === 'singleRow') {
    return '500px';
  }
};

const ProposalFormModal = ({ proposalType }) => {
  const [, setLoading] = useState(false);
  const [proposalForm, setProposalForm] = useState(null);
  const { customTerms } = useMetaData();
  const { theme } = useCustomTheme();
  const { proposalModal, setProposalModal } = useOverlay();

  const proposalForms = {
    signal: {
      heading: 'Signal That!',
      form: <FormBuilder {...FORM.SIGNAL} />,
    },
    member: {
      heading: `New ${getTerm(customTerms, 'member')} ${getTerm(
        customTerms,
        'proposal',
      )}`,
      form: <FormBuilder {...FORM.MEMBER} />,
    },
    funding: {
      heading: `New Funding ${getTerm(customTerms, 'proposal')}`,
      form: <FormBuilder {...FORM.FUNDING} />,
    },
    //  Are we using lootgrab anymore?
    lootgrab: {
      type: `New ${getTerm(customTerms, 'proposal')}`,
      heading: `New Loot Grab ${getTerm(customTerms, 'proposal')}`,
      subline: 'Submit a loot grab proposal here.',
      form: <FormBuilder {...FORM.LOOT_GRAB} />,
    },
    whitelist: {
      heading: `New Whitelist ${getTerm(customTerms, 'proposal')}`,
      form: <FormBuilder {...FORM.TOKEN} />,
    },
    guildkick: {
      heading: `New GuildKick ${getTerm(customTerms, 'proposal')}`,
      form: <FormBuilder {...FORM.GUILDKICK} />,
    },
    trade: {
      heading: `New Trade ${getTerm(customTerms, 'proposal')}`,
      form: <FormBuilder {...FORM.TRADE} />,
    },
    minion: {
      type: `New ${getTerm(customTerms, 'proposal')}`,
      heading: `New Minion ${getTerm(customTerms, 'proposal')}`,
      subline: 'Submit a Minion proposal here.',
      form: <MinionProposalForm />,
      // form: <ProposalForm {...FORM.MINION} />,
    },
    niftyMinion: {
      type: `New ${getTerm(customTerms, 'proposal')}`,
      heading: `New Minion ${getTerm(customTerms, 'proposal')}`,
      subline: 'Submit a Minion proposal here.',
      form: <NiftyProposalForm />,
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
    sellNft: {
      type: `New ${getTerm(customTerms, 'proposal')}`,
      heading: `New NFT Sale ${getTerm(customTerms, 'proposal')}`,
      subline: 'Submit new NFT Sell proposal here.',
      form: <FormBuilder {...FORM.SELL_NFT} />,
    },
  };

  useEffect(() => {
    if (proposalType) {
      setProposalForm(proposalForms[proposalType]);
    }
  }, [proposalType]);

  const handleClose = () => {
    setLoading(false);
    setProposalModal(false);
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
        maxWidth={getMaxWidth(proposalForm)}
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
        <ModalBody>{proposalForm?.form}</ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};

export default ProposalFormModal;
