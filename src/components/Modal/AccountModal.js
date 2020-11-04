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
  Box,
} from '@chakra-ui/core';

import {
  useTheme,
  useTxProcessor,
  useUser,
} from '../../contexts/PokemolContext';
import BrandImg from '../../assets/Daohaus__Castle--Dark.svg';
import UserAvatar from '../Shared/UserAvatar';
import MemberInfoCard from '../Dao/MemberInfoCard';

const AccountModal = ({ isOpen, setShowModal }) => {
  const [theme] = useTheme();
  const [user] = useUser();
  const [txProcessor] = useTxProcessor();

  const RenderTxList = () => {
    const txList = txProcessor.getTxUnseenList(user.username);
    // dummy data
    txList.push({ id: 1, description: 'test1' });
    txList.push({ id: 2, description: 'test2' });
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
              <Icon name='check' color='white' />
              <Icon name='arrow-forward' color='white' />
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
        p={6}
      >
        <ModalCloseButton />
        <ModalBody
          flexDirection='column'
          display='flex'
          maxH='300px'
          overflowY='scroll'
        >
          <MemberInfoCard user={user} />
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
