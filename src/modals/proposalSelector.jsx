import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalOverlay,
  Box,
  Flex,
} from '@chakra-ui/react';

import { rgba } from 'polished';

import { useOverlay } from '../contexts/OverlayContext';
import { useCustomTheme } from '../contexts/CustomThemeContext';

const ProposalSelector = () => {
  const { proposalSelector, setProposalSelector } = useOverlay();
  const { theme } = useCustomTheme();

  const handleClose = () => {
    setProposalSelector(false);
  };

  return (
    <Modal isOpen={proposalSelector} onClose={handleClose} isCentered>
      <ModalOverlay bgColor={rgba(theme.colors.background[500], 0.8)} />
      <ModalContent
        rounded='lg'
        bg='black'
        borderWidth='1px'
        borderColor='whiteAlpha.200'
      >
        <ModalHeader pb={0}>
          <Flex justify='space-between' align='center' w='90%'>
            <Box
              fontFamily='heading'
              textTransform='uppercase'
              fontSize='sm'
              fontWeight={700}
              mb={3}
              color='white'
            >
              What would you like to do?
            </Box>
          </Flex>
        </ModalHeader>
        <ModalCloseButton color='white' />
        <ModalBody
          flexDirection='column'
          display='flex'
          maxH='400px'
          overflowY='scroll'
        />
      </ModalContent>
    </Modal>
  );
};

export default ProposalSelector;
