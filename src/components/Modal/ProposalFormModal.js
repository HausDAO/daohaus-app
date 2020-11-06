import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalOverlay,
  Text,
} from '@chakra-ui/core';
import {
  useTheme,
} from '../../contexts/PokemolContext';
import MemberProposalForm from '../Forms/MemberProposal';
import FundingProposalForm from '../Forms/FundingProposal';
import WhitelistProposalForm from '../Forms/WhitelistProposal';
import GuildKickProposalForm from '../Forms/GuildKickProposal';
import TradeProposalForm from '../Forms/TradeProposal';

const ProposalFormModal = ({ proposalType, isOpen, setShowModal }) => {
  const [, setLoading] = useState(false);
  const [proposalForm, setProposalForm] = useState(null);
  const [theme] = useTheme();

  const proposalForms = {
    member: {
      type: `New ${theme.daoMeta.proposal}`,
      heading: `New ${theme.daoMeta.member} ${theme.daoMeta.proposal}`,
      subline: `Submit your membership proposal here.`,
      form: <MemberProposalForm />,
    },
    funding: {
      type: `New ${theme.daoMeta.proposal}`,
      heading: `New Funding ${theme.daoMeta.proposal}`,
      subline: `Submit a funding proposal here.`,
      form: <FundingProposalForm />,
    },
    whitelist: {
      type: `New ${theme.daoMeta.proposal}`,
      heading: `New Whitelist ${theme.daoMeta.proposal}`,
      subline: `Whitelist a token here.`,
      form: <WhitelistProposalForm />,
    },
    guildkick: {
      type: `New ${theme.daoMeta.proposal}`,
      heading: `New GuildKick ${theme.daoMeta.proposal}`,
      subline: `Kick a perpetrator here.`,
      form: <GuildKickProposalForm />,
    },
    trade: {
      type: `New ${theme.daoMeta.proposal}`,
      heading: `New Trade ${theme.daoMeta.proposal}`,
      subline: `Submit a trade proposal here.`,
      form: <TradeProposalForm />,
    },
  }

  useEffect(() => {
    if (proposalType) {
      setProposalForm(proposalForms[proposalType])
    }
  }, [proposalType])
  console.log(proposalForm);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setLoading(false);
        setShowModal(null);
      }}
      isCentered
    >
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
            <Text
              fontFamily={theme.fonts.heading}
              textTransform='uppercase'
              fontSize='xs'
              fontWeight={700}
              color='#7579C5'
              mb={4}
            >
              {proposalForm.type}
            </Text>
            <Text
              fontFamily={theme.fonts.heading}
              fontSize='xl'
              fontWeight={700}
              color='white'
            >
              {proposalForm.heading}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text color='#C4C4C4' mb={6}>
              {proposalForm.subline}
            </Text>
            {proposalForm.form}
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      )}
    </Modal>
  );
};

export default ProposalFormModal;
