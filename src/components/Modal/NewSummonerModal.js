import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalOverlay,
  Box,
  Text,
} from '@chakra-ui/react';

import { useModals } from '../../contexts/PokemolContext';

const NewSummonerModal = ({ isOpen }) => {
  const { closeModals } = useModals();

  return (
    <Modal isOpen={isOpen} onClose={() => closeModals()} isCentered>
      <ModalOverlay />
      <ModalContent
        rounded='lg'
        bg='black'
        borderWidth='1px'
        borderColor='whiteAlpha.200'
      >
        <ModalHeader>
          <Box
            fontFamily='heading'
            textTransform='uppercase'
            fontSize='sm'
            fontWeight={700}
            color='white'
          >
            Welcome to your new DaoHaus DAO
          </Box>
        </ModalHeader>
        <ModalCloseButton color='white' />
        <ModalBody
          flexDirection='column'
          display='flex'
          maxH='300px'
          overflowY='scroll'
        >
          <Text> What to do next?</Text>
          <Text> Make a new member proposal</Text>
          <Text> Whitelist a token</Text>
          <Text> Share with the world</Text>
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NewSummonerModal;
