import React from 'react';
import {
  Modal,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalOverlay,
} from '@chakra-ui/react';

import { useModals } from '../../contexts/PokemolContext';
import RageQuitForm from '../Forms/RageQuit';

const RageQuitModal = ({ isOpen }) => {
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
          <RageQuitForm />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default RageQuitModal;
