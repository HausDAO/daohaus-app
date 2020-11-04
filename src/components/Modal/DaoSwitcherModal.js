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
  Text,
  Flex,
  Avatar,
  Spinner,
  Image,
  Icon,
} from '@chakra-ui/core';
import makeBlockie from 'ethereum-blockies-base64';

import { useTheme, useUserDaos } from '../../contexts/PokemolContext';
import BrandImg from '../../assets/Daohaus__Castle--Dark.svg';

const DaoSwitcherModal = ({ isOpen, setShowModal }) => {
  const [theme] = useTheme();
  const [userDaos] = useUserDaos();

  const renderDaoSelect = () => {
    return userDaos.map((dao) => {
      return (
        <Link key={dao.id} to={`/dao/${dao.id}`}>
          <Flex
            direction='row'
            justifyContent='space-between'
            alignItems='center'
          >
            <Flex direction='row' justify='flex-start' alignItems='center'>
              <Avatar
                name={dao.title.substr(0, 1)}
                src={makeBlockie(dao.id)}
                mb={4}
                mr='10px'
              ></Avatar>
              <Text color='white'>{dao.title}</Text>
            </Flex>
            <Icon name='chevron-right' color='white' />
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
          <Text
            fontFamily={theme.fonts.heading}
            textTransform='uppercase'
            fontSize='sm'
            fontWeight={700}
            color='white'
          >
            Go to DAO
          </Text>
        </ModalHeader>
        <ModalCloseButton />
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
            >
              <Flex direction='row' justify='flex-start' alignItems='center'>
                <Image src={BrandImg} w='50px' mr='10px' />
                <Text color='white'>Hub</Text>
              </Flex>
              <Icon name='chevron-right' color='white' />
            </Flex>
          </Link>
          {userDaos ? <>{renderDaoSelect()}</> : <Spinner />}

          <h1>THE HELL</h1>
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DaoSwitcherModal;
