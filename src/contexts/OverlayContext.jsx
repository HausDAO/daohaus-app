import React, { createContext, useState, useContext } from 'react';
import { useToast } from '@chakra-ui/react';

export const OverlayContext = createContext();

export const OverlayProvider = ({ children }) => {
  const toast = useToast();
  const [modal, setModal] = useState(false);

  const [daoSwitcherModal, setDaoSwitcherModal] = useState(false);
  const [hubAccountModal, setHubAccountModal] = useState(false);
  const [daoAccountModal, setDaoAccountModal] = useState(false);
  const [proposalSelector, setProposalSelector] = useState(false);
  const [txInfoModal, setTxInfoModal] = useState(false);
  const [imageUploadModal, setImageUploadModal] = useState(false);
  const [d2dProposalTypeModal, setD2dProposalTypeModal] = useState(false);
  const [d2dProposalModal, setD2dProposalModal] = useState(false);
  const [nftViewModal, setNftViewModal] = useState(false);
  const [genericModal, setGenericModal] = useState({});

  const errorToast = content => {
    console.log(content);
    toast({
      title: content?.title,
      description: content?.description,
      position: 'top-right',
      status: 'error',
      duration: 7000,
      isClosable: true,
    });
  };
  const successToast = content => {
    toast({
      title: content?.title,
      description: content?.description,
      position: 'top-right',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  const warningToast = content => {
    toast({
      title: content.title,
      description: content.description,
      position: 'top-right',
      status: 'warning',
      duration: 5000,
      isClosable: true,
    });
  };

  // const useAppModal = params => {
  //   setModal(params);
  // };

  const closeModal = () => setModal(false);

  return (
    <OverlayContext.Provider
      value={{
        modal,
        setModal,
        daoSwitcherModal,
        setDaoSwitcherModal,
        hubAccountModal,
        setHubAccountModal,
        daoAccountModal,
        setDaoAccountModal,
        errorToast,
        successToast,
        warningToast,
        txInfoModal,
        setTxInfoModal,
        imageUploadModal,
        setImageUploadModal,
        d2dProposalTypeModal,
        setD2dProposalTypeModal,
        d2dProposalModal,
        setD2dProposalModal,
        genericModal,
        setGenericModal,
        proposalSelector,
        setProposalSelector,
        closeModal,
        nftViewModal,
        setNftViewModal,
      }}
    >
      {children}
    </OverlayContext.Provider>
  );
};

export default OverlayProvider;

export const useOverlay = () => {
  const {
    modal,
    setModal,
    daoSwitcherModal,
    setDaoSwitcherModal,
    hubAccountModal,
    setHubAccountModal,
    daoAccountModal,
    setDaoAccountModal,
    errorToast,
    successToast,
    warningToast,
    txInfoModal,
    setTxInfoModal,
    imageUploadModal,
    setImageUploadModal,
    d2dProposalTypeModal,
    setD2dProposalTypeModal,
    d2dProposalModal,
    setD2dProposalModal,
    genericModal,
    setGenericModal,
    proposalSelector,
    setProposalSelector,
    nftViewModal,
    setNftViewModal,
  } = useContext(OverlayContext);
  return {
    modal,
    setModal,
    daoSwitcherModal,
    setDaoSwitcherModal,
    daoAccountModal,
    setDaoAccountModal,
    hubAccountModal,
    setHubAccountModal,
    errorToast,
    successToast,
    warningToast,
    txInfoModal,
    setTxInfoModal,
    imageUploadModal,
    setImageUploadModal,
    d2dProposalTypeModal,
    setD2dProposalTypeModal,
    d2dProposalModal,
    setD2dProposalModal,
    genericModal,
    setGenericModal,
    proposalSelector,
    setProposalSelector,
    nftViewModal,
    setNftViewModal,
  };
};
