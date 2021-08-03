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
  Flex,
  Button,
} from '@chakra-ui/react';
import { rgba } from 'polished';

import { useOverlay } from '../contexts/OverlayContext';
import { useCustomTheme } from '../contexts/CustomThemeContext';
import FormBuilder from '../formBuilder/formBuilder';
import TextBox from '../components/TextBox';

const getMaxWidth = modal => {
  if (modal?.lego?.fields) {
    if (modal?.lego.fields?.length > 1) {
      return '800px';
    }
    return '500px';
  }
  if (modal?.width === 'sm') return '400px';
  if (modal?.width === 'md') return '500px';
  if (modal?.width === 'lg') return '650px';
  if (modal?.width === 'xl') return '600px';
  if (modal?.width?.includes('px')) return modal?.width;
  return '500px';
};

const DaoModal = () => {
  const { theme } = useCustomTheme();
  const { modal, setModal } = useOverlay();
  const {
    lego,
    header,
    title,
    body,
    footer,
    onSubmit,
    onCancel,
    isConfirmation,
    loading,
  } = modal;

  const handleClose = () => setModal(false);

  return (
    <Modal
      isOpen={modal}
      onClose={handleClose}
      closeOnOverlayClick={false}
      isCentered
    >
      <ModalOverlay
        bgColor={rgba(theme.colors.background[500], 0.8)}
        style={{ backdropFilter: 'blur(6px)' }}
      />
      <ModalContent
        rounded='lg'
        bg='blackAlpha.600'
        borderWidth='1px'
        borderColor='whiteAlpha.200'
        maxWidth={getMaxWidth(modal)}
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
            {lego?.title || title}
          </Box>
          {header && (
            <TextBox size='md' variant='label'>
              {header}
            </TextBox>
          )}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {lego ? <FormBuilder {...lego} onSubmit={onSubmit} /> : body}
        </ModalBody>
        <ModalFooter>
          {footer}
          {isConfirmation && (
            <ConfirmationFooter
              onSubmit={onSubmit}
              onCancel={onCancel || handleClose}
              loading={loading}
            />
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DaoModal;

const ConfirmationFooter = ({ onCancel, onSubmit, loading }) => {
  return (
    <Box>
      <Flex alignItems='flex-end' flexDir='column'>
        <Flex mb={2}>
          <Button
            variant='outline'
            borderTopRightRadius='0'
            borderBottomRightRadius='0'
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            loadingText='Submitting'
            isLoading={loading}
            disabled={loading}
            borderBottomLeftRadius='0'
            borderTopLeftRadius='0'
          >
            Submit
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};
