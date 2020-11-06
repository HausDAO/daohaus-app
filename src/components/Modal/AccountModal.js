import React from 'react';
import { Link } from 'react-router-dom';
import {
  Modal,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalOverlay,
  Text,
  Flex,
  Icon,
  Box,
  Spinner,
} from '@chakra-ui/core';

import { FaExternalLinkAlt, FaRegCheckCircle } from 'react-icons/fa';

import {
  useTheme,
  useTxProcessor,
  useUser,
  useDao,
} from '../../contexts/PokemolContext';

import MemberInfoCard from '../Dao/MemberInfoCard';
import HubProfileCard from '../Hub/HubProfileCard';

const AccountModal = ({ isOpen, setShowModal }) => {
  const [theme] = useTheme();
  const [user] = useUser();
  const [dao] = useDao();
  const [txProcessor] = useTxProcessor();

  console.log('DAODAODAODAODA', dao);

  const RenderTxList = () => {
    const txList = txProcessor.getTxUnseenList(user.username);
    // dummy data
    txList.push({ id: 1, description: 'test tx 1' });
    txList.push({ id: 2, description: 'test tx 2' });
    return txList.map((tx) => {
      return (
        <Box id={tx.id} key={tx.id}>
          <Flex
            direction='row'
            justifyContent='space-between'
            alignItems='center'
          >
            <Flex direction='row' justify='flex-start' alignItems='center'>
              <Text color='white'>{tx.description}</Text>
            </Flex>
            <Box>
              {tx.open ? (
                <Icon as={Spinner} name='check' color='white' />
              ) : (
                <Icon as={FaRegCheckCircle} name='check' color='white' />
              )}
              <Icon as={FaExternalLinkAlt} name='arrow-forward' color='white' />
            </Box>
          </Flex>
        </Box>
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
        color='white'
        p={6}
      >
        <ModalCloseButton />
        <ModalBody
          flexDirection='column'
          display='flex'
          maxH='600px'
          overflowY='scroll'
        >
          {!dao.address ? (
            <HubProfileCard user={user} />
          ) : (
            <MemberInfoCard user={user} />
          )}
          <Box p={6}>
            <Flex
              direction='row'
              justifyContent='space-between'
              alignItems='center'
            >
              <Flex direction='row' justify='flex-start' alignItems='center'>
                <Link to='/profile'>
                  <Text color='white'>Profile</Text>
                </Link>
              </Flex>

              <Link to='/'>
                <Text color='white'>Hub</Text>
              </Link>
            </Flex>
          </Box>
          <RenderTxList />
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AccountModal;
