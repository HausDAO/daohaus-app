import React, { createContext, useState, useContext } from "react";
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
  Lorem,
  useDisclosure,
} from "@chakra-ui/react";

const OverlayContext = createContext();

export const OverlayProvider = ({ children }) => {
  const toast = useToast();
  const [modalContent, setModalContent] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const modalWithContent = (modalContent) => {
    setModalContent(modalContent);
    onOpen();
  };
  const closeModal = () => {
    setModalContent(null);
    onClose();
  };
  const errorToast = (content) => {
    toast({
      title: content.title,
      description: content.description,
      position: "top-right",
      status: "error",
      duration: 7000,
      isClosable: true,
    });
  };
  const successToast = (content) => {
    toast({
      title: content.title,
      description: content.description,
      position: "top-right",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
  const warningToast = (content) => {
    toast({
      title: content.title,
      description: content.description,
      position: "top-right",
      status: "warning",
      duration: 5000,
      isClosable: true,
    });
  };
  return (
    <OverlayContext.Provider
      value={{
        modalWithContent,
        closeModal,
        errorToast,
        successToast,
        warningToast,
      }}
    >
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {modalContent?.header ? modalContent.header : "Header"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>{modalContent?.body && modalContent.body}</ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            {modalContent?.secondaryBtn && (
              <Button variant="ghost">Secondary Action</Button>
            )}
          </ModalFooter>
        </ModalContent>
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
