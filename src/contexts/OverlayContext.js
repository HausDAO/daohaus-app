import React, { createContext, useState, useContext } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  Button,
  // Lorem,
  useDisclosure,
} from '@chakra-ui/react';

const OverlayContext = createContext();

export const OverlayProvider = ({ children }) => {
  const toast = useToast();
  const [modalContent, setModalContent] = useState(null);
  const [modalType, setModalType] = useState('small');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const modalWithContent = (modalType = 'small', modalContent) => {
    setModalContent(modalContent);
    onOpen();
  };
  const replaceModalContent = (modalContent) => {
    setModalContent(modalContent);
  };
  const closeModal = () => {
    setModalContent(null);
    onClose();
  };
  const errorToast = (content) => {
    toast({
      title: content.title,
      description: content.description,
      position: 'top-right',
      status: 'error',
      duration: 7000,
      isClosable: true,
    });
  };
  const successToast = (content) => {
    toast({
      title: content.title,
      description: content.description,
      position: 'top-right',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  const warningToast = (content) => {
    toast({
      title: content.title,
      description: content.description,
      position: 'top-right',
      status: 'warning',
      duration: 5000,
      isClosable: true,
    });
  };

  const getModalBody = () => {
    if (modalType === 'small') {
      return (
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
              {modalContent?.header ? modalContent.header : 'Header'}
            </Box>
          </ModalHeader>
          <ModalBody>{modalContent?.body && modalContent.body}</ModalBody>;
          <ModalCloseButton />
          {getModalBody()}
          {modalContent?.footer && <ModalFooter> modal.footer</ModalFooter>}
        </ModalContent>
      );
    }
  };

  // GENERAL STRUCTURE OF modalContent state

  return (
    <OverlayContext.Provider
      value={{
        modalWithContent,
        closeModal,
        replaceModalContent,
        errorToast,
        successToast,
        warningToast,
      }}
    >
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
      </Modal>
      {children}
    </OverlayContext.Provider>
  );
};

export default OverlayProvider;

export const useOverlay = () => {
  const {
    modalWithContent,
    closeModal,
    errorToast,
    successToast,
    warningToast,
  } = useContext(OverlayContext);
  return {
    modalWithContent,
    closeModal,
    errorToast,
    successToast,
    warningToast,
  };
};
