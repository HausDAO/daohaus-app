import React, { useState } from 'react';
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

const ProposalFormModal = ({ isOpen, setShowModal }) => {
  const [, setLoading] = useState(false);

  const [theme] = useTheme();

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
            New {theme.daoMeta.proposal}
          </Text>
          <Text
            fontFamily={theme.fonts.heading}
            fontSize='xl'
            fontWeight={700}
            color='white'
          >
            New {theme.daoMeta.member} {theme.daoMeta.proposal}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text color='#C4C4C4' mb={6}>
            Submit your membership proposal here.
          </Text>
          <MemberProposalForm />
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProposalFormModal;
