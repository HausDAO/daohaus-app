import React from 'react';
import {
  Modal,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalOverlay,
} from '@chakra-ui/react';
import { rgba } from 'polished';

import { useOverlay } from '../contexts/OverlayContext';
import { useCustomTheme } from '../contexts/CustomThemeContext';

const GenericModal = ({ children, modalId, closeOnOverlayClick = true }) => {
  const { genericModal, setGenericModal } = useOverlay();
  const { theme } = useCustomTheme();

  return (
    <Modal
      isOpen={genericModal[modalId]}
      closeOnEsc={false}
      closeOnOverlayClick={closeOnOverlayClick}
      onClose={() => setGenericModal({})}
      isCentered
    >
      <ModalOverlay
        bgColor={rgba(theme.colors.background[500], 0.8)}
        style={{ backdropFilter: 'blur(6px)' }}
      />
      <ModalContent
        rounded='lg'
        bg='blackAlpha.800'
        borderWidth='1px'
        borderColor='whiteAlpha.200'
        py={6}
      >
        <ModalCloseButton />
        <ModalBody
          flexDirection='column'
          display='flex'
          maxH='600px'
          overflow='auto'
        >
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default GenericModal;
