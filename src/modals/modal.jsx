import React from 'react';
import {
  Modal as ChakraModal,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalOverlay,
  Box,
  Flex,
  Button,
  useTheme,
} from '@chakra-ui/react';
import { rgba } from 'polished';

import { useOverlay } from '../contexts/OverlayContext';
import { useCustomTheme } from '../contexts/CustomThemeContext';
import TextBox from '../components/TextBox';
import { capitalizeWords } from '../utils/general';

// const getMaxWidth = modal => {
//   // if (modal.steps) return '500px';
//   if (modal?.lego?.fields) {
//     if (modal?.lego.fields?.length > 1) {
//       return '800px';
//     }
//     return '500px';
//   }
//   if (modal?.width === 'sm') return '400px';
//   if (modal?.width === 'md') return '500px';
//   if (modal?.width === 'lg') return '650px';
//   if (modal?.width === 'xl') return '600px';
//   if (modal?.width?.includes('px')) return modal?.width;
//   return '600px';
// };

const Modal = () => {
  const { theme } = useCustomTheme();
  const { modal, setModal } = useOverlay();
  const {
    title,
    subtitle,
    body,
    footer,
    loading,
    width = '600px',
    description,
  } = modal;
  console.log();
  const handleClose = () => setModal(false);
  return (
    <ChakraModal
      isOpen={modal}
      onClose={handleClose}
      closeOnOverlayClick={false}
      isCentered
    >
      <ModalOverlay
        bgColor={rgba(theme.colors.background[500], 0.8)}
        style={{ backdropFilter: 'blur(6px)' }}
      />
      <ModalContent rounded='lg' bg='black' maxWidth={width}>
        <ModalBody>
          <Flex p={6} position='relative' flexDir='column'>
            <Box
              fontFamily='heading'
              textTransform='uppercase'
              fontSize='xs'
              fontWeight={700}
              color='secondary.500'
            >
              {subtitle}
            </Box>
            <ModalCloseButton top='4' />
            <TextBox mb={4} size='lg' variant='body' fontWeight='600'>
              {capitalizeWords(title)}
            </TextBox>
            {/* {description && (
              // <Flex
              //   border={`1px ${theme.colors.secondary['500']} solid`}
              //   p={4}
              //   mb={6}
              //   borderRadius='md'
              // >
              <TextBox size='sm' variant='body' opacity={0.9} mb={6}>
                {description}
              </TextBox>
              // </Flex>
            )} */}
            {body}
            {footer && (
              <Footer
                onCancel={footer.onCancel}
                onSubmit={footer.onSubmit}
                loading={loading}
              />
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </ChakraModal>
  );
};

export default Modal;

const Footer = ({ onCancel, onSubmit, loading }) => {
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
