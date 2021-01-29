import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Avatar,
  Spinner,
  Image,
} from '@chakra-ui/react';
import makeBlockie from 'ethereum-blockies-base64';
import { RiArrowRightSLine } from 'react-icons/ri';

import BrandImg from '../assets/img/Daohaus__Castle--Dark.svg';
import { useUser } from '../contexts/UserContext';
import { getDaosByNetwork } from '../utils/dao';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { themeImagePath } from '../utils/metadata';
import { useOverlay } from '../contexts/OverlayContext';

const DaoSwitcherModal = () => {
  const { daoSwitcherModal, setDaoSwitcherModal } = useOverlay();
  const { userHubDaos } = useUser();
  const { injectedChain } = useInjectedProvider();
  const daosByNetwork =
    userHubDaos && injectedChain?.chainId
      ? getDaosByNetwork(userHubDaos, injectedChain.chainId)
      : {};

  const handleClose = () => {
    setDaoSwitcherModal(false);
  };

  const renderDaoList = (network) =>
    network.data.map((dao) => (
      <Link
        key={dao.id}
        to={`/dao/${network.networkID}/${dao.meta?.contractAddress ||
          dao.moloch?.id}`}
        onClick={handleClose}
      >
        <Flex
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          py={2}
        >
          <Flex direction='row' justify='start' alignItems='center'>
            <Avatar
              name={dao.meta?.name.substr(0, 1)}
              src={
                dao.meta?.avatarImg
                  ? themeImagePath(dao.meta?.avatarImg)
                  : makeBlockie(dao.id)
              }
              mr='10px'
            ></Avatar>
            <Box color='white'>{dao.meta?.name}</Box>
          </Flex>
          <RiArrowRightSLine color='white' />
        </Flex>
      </Link>
    ));

  const renderCurrentNetwork = () => {
    const currentNetwork = daosByNetwork?.currentNetwork || null;
    if (currentNetwork) {
      return (
        <Box key={currentNetwork.networkID} mb={3}>
          <Box fontSize='md' mr={5} as='i' fontWeight={200}>
            {currentNetwork.name}
          </Box>
          {renderDaoList(currentNetwork)}
        </Box>
      );
    }
  };

  const renderOtherNetworks = () =>
    daosByNetwork?.otherNetworks &&
    daosByNetwork.otherNetworks.map((network, i) => {
      return (
        <Box key={network.networkID} mb={3}>
          <Box fontSize='md' mr={5} as='i' fontWeight={200}>
            {network.name}
          </Box>
          {renderDaoList(network)}
        </Box>
      );
    });

  return (
    <Modal isOpen={daoSwitcherModal} onClose={handleClose} isCentered>
      <ModalOverlay />
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
            Go to DAO
          </Box>
        </ModalHeader>
        <ModalCloseButton color='white' />
        <ModalBody
          flexDirection='column'
          display='flex'
          maxH='300px'
          overflowY='scroll'
        >
          <Link to='/' onClick={handleClose}>
            <Flex
              direction='row'
              justifyContent='space-between'
              alignItems='center'
              py={2}
              mb={3}
              borderBottom='1px solid'
              borderColor='whiteAlpha.400'
            >
              <Flex direction='row' justify='flex-start' alignItems='center'>
                <Image src={BrandImg} w='50px' mr='10px' />
                <Box color='white'>Hub</Box>
              </Flex>
              <RiArrowRightSLine color='white' />
            </Flex>
          </Link>
          Current Network:
          {userHubDaos ? <>{renderCurrentNetwork()}</> : <Spinner />}
          Other Networks:
          {userHubDaos ? <>{renderOtherNetworks()}</> : <Spinner />}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DaoSwitcherModal;
