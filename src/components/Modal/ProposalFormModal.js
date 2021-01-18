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

import { useTheme } from '../../contexts/CustomThemeContext';
import MemberProposalForm from '../Forms/MemberProposal';
import FundingProposalForm from '../Forms/FundingProposal';
import WhitelistProposalForm from '../Forms/WhitelistProposal';
import GuildKickProposalForm from '../Forms/GuildKickProposal';
import TradeProposalForm from '../Forms/TradeProposal';
import MinionSimpleProposalForm from '../Forms/MinionSimpleProposal';
import TransmutationProposal from '../Forms/TransmutationProposal';
import { useModals } from '../../contexts/PokemolContext';

const ProposalFormModal = ({ proposalType, isOpen, returnRoute, presets }) => {
  const [, setLoading] = useState(false);
  const [proposalForm, setProposalForm] = useState(null);
  const [theme] = useTheme();
  const history = useHistory();
  const { closeModals } = useModals();

  const proposalForms = {
    member: {
      type: `New ${theme.daoMeta.proposal}`,
      heading: `New ${theme.daoMeta.member} ${theme.daoMeta.proposal}`,
      subline: `Submit your membership proposal here.`,
      form: <MemberProposalForm presets={presets} />,
      presets: null,
    },
    funding: {
      type: `New ${theme.daoMeta.proposal}`,
      heading: `New Funding ${theme.daoMeta.proposal}`,
      subline: `Submit a funding proposal here.`,
      form: <FundingProposalForm presets={presets} />,
      presets: null,
    },
    whitelist: {
      type: `New ${theme.daoMeta.proposal}`,
      heading: `New Whitelist ${theme.daoMeta.proposal}`,
      subline: `Whitelist a token here.`,
      form: <WhitelistProposalForm presets={presets} />,
      presets: null,
    },
    guildkick: {
      type: `New ${theme.daoMeta.proposal}`,
      heading: `New GuildKick ${theme.daoMeta.proposal}`,
      subline: `Kick a perpetrator here.`,
      form: <GuildKickProposalForm presets={presets} />,
      presets: null,
    },
    trade: {
      type: `New ${theme.daoMeta.proposal}`,
      heading: `New Trade ${theme.daoMeta.proposal}`,
      subline: `Submit a trade proposal here.`,
      form: <TradeProposalForm presets={presets} />,
      presets: null,
    },
    minion: {
      type: `New ${theme.daoMeta.proposal}`,
      heading: `New Minion ${theme.daoMeta.proposal}`,
      subline: `Submit a Minion proposal here.`,
      form: <MinionSimpleProposalForm presets={presets} />,
      presets: null,
    },
    transmutation: {
      type: `New ${theme.daoMeta.proposal}`,
      heading: `New Transmutation ${theme.daoMeta.proposal}`,
      subline: `Submit a Transmutation proposal here.`,
      form: <TransmutationProposal presets={presets} />,
      presets: {},
    },
  };

  useEffect(() => {
    if (proposalType) {
      let _presets = proposalForms[proposalType];
      if (presets) {
        _presets = { ..._presets, ...presets };
      }
      setProposalForm(_presets);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposalType, presets]);

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
              {proposalForm.heading}
            </Box>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* <Box color='#C4C4C4' mb={6}>
              {proposalForm.subline}
            </Box> */}
            {proposalForm.form}
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      )}
    </Modal>
  );
};

export default ProposalFormModal;
