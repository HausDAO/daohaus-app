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
} from '@chakra-ui/react';
import { rgba } from 'polished';

import { useOverlay } from '../contexts/OverlayContext';
import { useCustomTheme } from '../contexts/CustomThemeContext';
import FormBuilder from '../formBuilder/formBuilder';

const getMaxWidth = layout => {
  if (layout === 'doubleColumn') return '800px';
  if (layout === 'singleColumn') return '500px';
  return '800px';
};

const FormModal = () => {
  const { theme } = useCustomTheme();
  const { formModal, setFormModal } = useOverlay();
  const handleClose = () => setFormModal(false);

  return (
    <Modal
      isOpen={formModal}
      onClose={handleClose}
      closeOnOverlayClick={false}
      isCentered
    >
      <ModalOverlay bgColor={rgba(theme.colors.background[500], 0.8)} />
      <ModalContent
        rounded='lg'
        bg='blackAlpha.600'
        borderWidth='1px'
        borderColor='whiteAlpha.200'
        maxWidth={getMaxWidth(formModal?.layout)}
        p={3}
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
            {formModal?.heading || formModal?.title}
          </Box>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormBuilder {...formModal} />
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};

export default FormModal;
