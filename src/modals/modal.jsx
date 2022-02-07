import React from 'react';
import {
  Modal as ChakraModal,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalOverlay,
  Box,
  Flex,
} from '@chakra-ui/react';
import { rgba } from 'polished';

import { useOverlay } from '../contexts/OverlayContext';
import { useCustomTheme } from '../contexts/CustomThemeContext';
import FormFooter from '../formBuilder/formFooter';
import TextBox from '../components/TextBox';

const Modal = () => {
  const { theme } = useCustomTheme();
  const { modal, setModal } = useOverlay();
  const { title, subtitle, body, footer, width = '600px', description } = modal;

  const handleClose = () => setModal(false);

  return (
    <ChakraModal
      isOpen={modal}
      onClose={handleClose}
      closeOnOverlayClick={false}
      isCentered
      scrollBehavior='inside'
    >
      <ModalOverlay
        bgColor={rgba(theme.colors.background[500], 0.8)}
        style={{ backdropFilter: 'blur(6px)' }}
      />
      <ModalContent
        borderWidth='1px'
        borderColor='whiteAlpha.200'
        rounded='lg'
        bg='#0b0b0b'
        maxWidth={width}
        maxH='100vh'
        overflowY='auto'
      >
        <ModalBody>
          <Flex px={[3, 6]} py={[2, 4]} position='relative' flexDir='column'>
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
            {title && (
              <TextBox
                mb={2}
                size='lg'
                variant='body'
                fontWeight='500'
                mr={4}
                textTransform='capitalize'
              >
                {title}
              </TextBox>
            )}
            {description && (
              <TextBox size='sm' variant='body' opacity={0.9} mb={3}>
                {description}
              </TextBox>
            )}
            <Box mb={2}>{body}</Box>
            {footer && (
              <FormFooter
                customPrimaryBtn={footer?.primaryBtn}
                customSecondaryBtn={footer?.secondaryBtn}
              />
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </ChakraModal>
  );
};

export default Modal;
