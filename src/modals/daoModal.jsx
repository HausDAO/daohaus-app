import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalOverlay,
  Box,
  Flex,
  Button,
} from '@chakra-ui/react';
import { rgba } from 'polished';

import { useOverlay } from '../contexts/OverlayContext';
import { useCustomTheme } from '../contexts/CustomThemeContext';
import TextBox from '../components/TextBox';
import FormBuilder from '../formBuilder/formBuilder';
import StepperForm from '../formBuilder/StepperForm';

// PURGe
const getMaxWidth = modal => {
  // if (modal.steps) return '500px';
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
  return '600px';
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
    prependBody,
    appendBody,
    steps,
    boost,
    temporary,
  } = modal;

  const handleClose = () => setModal(false);
  const modalHeader = lego?.title || title;
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
        <ModalHeader p={3}>
          {modalHeader && (
            <Box
              fontFamily='heading'
              textTransform='uppercase'
              fontSize='xs'
              fontWeight={700}
              color='#7579C5'
              mb={2}
            >
              {modalHeader}
            </Box>
          )}
          {header && <TextBox>{header}</TextBox>}
        </ModalHeader>

        <ModalCloseButton right={4} top={4} />
        <ModalBody p={3}>
          {prependBody}
          {steps && <StepperForm steps={steps} />}
          {boost && <StepperForm {...boost} />}
          {lego && <FormBuilder {...lego} onSubmit={onSubmit} />}
          {body && <Flex p={3}>{body}</Flex>}
          {temporary && (
            <Flex>
              <TextBox variant='body' size='sm' mb={3} p={0}>
                {temporary}
              </TextBox>
            </Flex>
          )}
          {appendBody}
        </ModalBody>
        {footer}
        {isConfirmation && (
          <ConfirmationFooter
            onSubmit={onSubmit}
            onCancel={onCancel || handleClose}
            loading={loading}
          />
        )}
      </ModalContent>
    </Modal>
  );
};

export default DaoModal;

const ConfirmationFooter = ({ onCancel, onSubmit, loading }) => {
  const handleCancel = () => onCancel?.();
  return (
    <Box>
      <Flex alignItems='flex-end' flexDir='column'>
        <Flex mb={2}>
          <Button
            variant='outline'
            borderTopRightRadius='0'
            borderBottomRightRadius='0'
            onClick={handleCancel}
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
