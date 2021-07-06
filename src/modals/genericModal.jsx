import React from 'react';
import {
  Modal,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalOverlay,
  ModalHeader,
  Box,
} from '@chakra-ui/react';
import { rgba } from 'polished';

import { useOverlay } from '../contexts/OverlayContext';
import { useCustomTheme } from '../contexts/CustomThemeContext';
import FormBuilder from '../formBuilder/formBuilder';

const GenericModal = ({
  children,
  modalId,
  title,
  formLego,
  closeOnOverlayClick = true,
}) => {
  const { genericModal, setGenericModal } = useOverlay();
  const { theme } = useCustomTheme();

  const closeModal = () => setGenericModal({});

  return (
    <Modal
      isOpen={genericModal[modalId]}
      closeOnEsc={false}
      closeOnOverlayClick={closeOnOverlayClick}
      onClose={closeModal}
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
        <ModalHeader>
          <Box
            fontFamily='heading'
            textTransform='uppercase'
            fontSize='sm'
            fontWeight={700}
            color='white'
          >
            {formLego?.title || title}
          </Box>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          flexDirection='column'
          display='flex'
          maxH='600px'
          overflow='auto'
        >
          {formLego ? <FormBuilder {...formLego} /> : children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default GenericModal;
