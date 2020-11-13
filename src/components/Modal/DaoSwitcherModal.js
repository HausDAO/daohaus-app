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
} from '@chakra-ui/core';
import makeBlockie from 'ethereum-blockies-base64';
import { RiArrowRightSLine } from 'react-icons/ri';

import { useUserDaos } from '../../contexts/PokemolContext';
import BrandImg from '../../assets/Daohaus__Castle--Dark.svg';

const DaoSwitcherModal = ({ isOpen, setShowModal }) => {
  const [userDaos] = useUserDaos();

  const renderDaoSelect = () => {
    return userDaos.map((dao) => {
      return (
        <Link
          key={dao.id}
          to={`/dao/${dao.id}`}
          onClick={() => setShowModal(false)}
        >
          <Flex
            direction='row'
            justifyContent='space-between'
            alignItems='center'
          >
            <Flex direction='row' justify='start' alignItems='center' mb={4}>
              <Avatar
                name={dao.title.substr(0, 1)}
                src={makeBlockie(dao.id)}
                mr='10px'
              ></Avatar>
              <Box color='white'>{dao.title}</Box>
            </Flex>
            <RiArrowRightSLine color='white' />
          </Flex>
        </Link>
      );
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={() => setShowModal(null)} isCentered>
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
          <Link to='/'>
            <Flex
              direction='row'
              justifyContent='space-between'
              alignItems='center'
              mb={4}
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
