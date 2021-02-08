import React from 'react';
import {
  Modal,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalOverlay,
} from '@chakra-ui/react';

import { useOverlay } from '../contexts/OverlayContext';

const GenericModal = ({ children, modalId, closeOnOverlayClick = true }) => {
  const { genericModal, setGenericModal } = useOverlay();

  return (
    <Modal
      isOpen={genericModal[modalId]}
      closeOnEsc={false}
      closeOnOverlayClick={closeOnOverlayClick}
      onClose={() => setGenericModal({})}
      isCentered
    >
      <ModalOverlay bgColor='background.500' />
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
