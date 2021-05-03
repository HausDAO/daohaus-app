import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalOverlay,
  Box,
  Flex,
  Avatar,
  Spinner,
  Image,
  Input,
  FormControl,
} from '@chakra-ui/react';
import makeBlockie from 'ethereum-blockies-base64';
import { RiArrowRightSLine } from 'react-icons/ri';
import { rgba } from 'polished';

import BrandImg from '../assets/img/Daohaus__Castle--Dark.svg';
import { useUser } from '../contexts/UserContext';
import { getDaosByNetwork, filterDAOsByName } from '../utils/dao';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { themeImagePath } from '../utils/metadata';
import { useOverlay } from '../contexts/OverlayContext';
import { useCustomTheme } from '../contexts/CustomThemeContext';

const DaoSwitcherModal = () => {
  const { daoSwitcherModal, setDaoSwitcherModal } = useOverlay();
  const { userHubDaos } = useUser();
  const { injectedChain } = useInjectedProvider();
  const { theme } = useCustomTheme();

  const [searchTerm, setSearchTerm] = useState(null);
  const [daosByNetwork, setDaosByNetwork] = useState({});
  const [filteredDaos, setFilteredDaos] = useState();

  // const daosByNetwork =
  //   userHubDaos && injectedChain?.chainId
  //     ? getDaosByNetwork(userHubDaos, injectedChain.chainId)
  //     : {};

  useEffect(() => {
    if ((userHubDaos, injectedChain && injectedChain.chainId)) {
      const newNetworks = getDaosByNetwork(userHubDaos, injectedChain.chainId);
      setDaosByNetwork(newNetworks);
    }
  }, [userHubDaos, injectedChain]);

  useEffect(() => {
    // console.log('daosByNetwork', daosByNetwork);
    // console.log('searchTerm', searchTerm);
    if (daosByNetwork) {
      if (!searchTerm || typeof searchTerm !== 'string') {
        setFilteredDaos(daosByNetwork);
      } else {
        setFilteredDaos({
          currentNetwork: filterDAOsByName(
            daosByNetwork.currentNetwork,
            searchTerm,
          ),
          otherNetworks: daosByNetwork.otherNetworks.map(network =>
            filterDAOsByName(network, searchTerm),
          ),
        });
      }
    }
  }, [searchTerm, daosByNetwork]);

  const handleChange = event => {
    setSearchTerm(event.target.value);
  };

  const handleClose = () => {
    setDaoSwitcherModal(false);
  };

  const renderDaoList = network =>
    network?.data &&
    network.data.map(dao => (
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
            />
            <Box color='white'>{dao.meta?.name}</Box>
          </Flex>
          <RiArrowRightSLine color='white' />
        </Flex>
      </Link>
    ));

  const renderCurrentNetwork = () => {
    const currentNetwork = filteredDaos?.currentNetwork || null;
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
    return null;
  };

  const renderOtherNetworks = () =>
    filteredDaos?.otherNetworks &&
    filteredDaos.otherNetworks.map(network => {
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
      <ModalOverlay bgColor={rgba(theme.colors.background[500], 0.8)} />
      <ModalContent
        rounded='lg'
        bg='black'
        borderWidth='1px'
        borderColor='whiteAlpha.200'
      >
        <ModalHeader pb={0}>
          <Flex justify='space-between' align='center' w='90%'>
            <Box
              fontFamily='heading'
              textTransform='uppercase'
              fontSize='sm'
              fontWeight={700}
              mb={3}
              color='white'
            >
              Go to DAO
            </Box>
            <FormControl w='auto' mb={4}>
              <Input
                type='search'
                className='input'
                placeholder='Search My Daos'
                maxW={200}
                onChange={e => handleChange(e)}
              />
            </FormControl>
          </Flex>
        </ModalHeader>
        <ModalCloseButton color='white' />
        <ModalBody
          flexDirection='column'
          display='flex'
          maxH='400px'
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
