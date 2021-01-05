import React from 'react';
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

import {
  useDao,
  useModals,
  useUser,
  useUserDaos,
  useWeb3Connect,
} from '../../contexts/PokemolContext';
import BrandImg from '../../assets/Daohaus__Castle--Dark.svg';

const DaoSwitcherModal = ({ isOpen }) => {
  const [userDaos] = useUserDaos();
  const { closeModals } = useModals();
  const [web3Connect] = useWeb3Connect();
  const [user] = useUser();
  const [, clearDaoData] = useDao();

  const handleNav = (fromHub) => {
    if (fromHub) {
      clearDaoData({
        ...web3Connect,
        forceUserInit:
          !user ||
          web3Connect.w3c.providerController.network !==
            user.providerNetwork.network,
      });
    } else {
      clearDaoData();
    }
    closeModals();
  };

  const renderDaoSelect = () => {
    return userDaos
      .filter((dao) => {
        return (
          (dao.version === '2' || dao.version === '2.1') && dao.apiMetadata
        );
      })
      .sort((a, b) => a.hubSort - b.hubSort)
      .map((dao, i) => {
        return (
          <Link key={i} to={`/dao/${dao.id}`} onClick={handleNav}>
            <Flex
              direction='row'
              justifyContent='space-between'
              alignItems='center'
              py={2}
            >
              <Flex direction='row' justify='start' alignItems='center'>
                <Avatar
                  name={dao.apiMetaData?.name.substr(0, 1)}
                  src={makeBlockie(dao.id)}
                  mr='10px'
                ></Avatar>
                <Box color='white'>{dao.apiMetadata.name}</Box>
              </Flex>
              <RiArrowRightSLine color='white' />
            </Flex>
          </Link>
        );
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={() => closeModals()} isCentered>
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
          <Link to='/' onClick={() => handleNav(true)}>
            <Flex
              direction='row'
              justifyContent='space-between'
              alignItems='center'
              py={2}
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
          {userDaos ? <>{renderDaoSelect()}</> : <Spinner />}
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DaoSwitcherModal;
