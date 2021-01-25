import React from 'react';
import {
  Modal,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalOverlay,
} from '@chakra-ui/react';

import { useModals } from '../../contexts/PokemolContext';

const GenericModal = ({ isOpen, children }) => {
  const { closeModals } = useModals();

  return (
    <Modal isOpen={isOpen} onClose={() => closeModals()} isCentered>
      <ModalOverlay />
      <ModalContent
        rounded='lg'
        bg='blackAlpha.800'
        borderWidth='1px'
        borderColor='whiteAlpha.200'
        py={6}
      >
        <ModalCloseButton />
        <ModalBody flexDirection='column' display='flex' maxH='600px'>
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default GenericModal;
