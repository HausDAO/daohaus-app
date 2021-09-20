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
import TextBox from '../components/TextBox';
import FormFooter from '../formBuilder/formFooter';

const Modal = () => {
  const { theme } = useCustomTheme();
  const { modal, setModal } = useOverlay();
  const { title, subtitle, body, footer, width = '600px' } = modal;

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
              <TextBox mb={4} size='lg'>
                {title}
              </TextBox>
            )}
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
            <Box mb={2}>{body}</Box>
            {footer && (
              <FormFooter
                customPrimaryBtn={footer?.primaryBtn}
                customSecondaryBtn={footer?.secondaryBtn}
              />
              // <Footer
              //   onCancel={footer.onCancel}
              //   onSubmit={footer.onSubmit}
              //   loading={loading}
              // />
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </ChakraModal>
  );
};

export default Modal;
