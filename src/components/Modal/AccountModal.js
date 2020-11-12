import React from 'react';
import {
  Link,
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

import { RiExternalLinkLine, RiCheckboxCircleLine } from 'react-icons/ri';

import {
  useTheme,
  useTxProcessor,
  useUser,
  useDao,
} from '../../contexts/PokemolContext';

import MemberInfoCard from '../Dao/MemberInfoCard';
import HubProfileCard from '../Hub/HubProfileCard';

const AccountModal = ({ isOpen, setShowModal }) => {
  const [user] = useUser();
  const [dao] = useDao();
  const [txProcessor] = useTxProcessor();

  console.log('DAODAODAODAODA', dao);

  const RenderTxList = () => {
    const txList = txProcessor.getTxUnseenList(user.username);
    // dummy data
    txList.push({ id: 1, description: 'Sponsor Proposal' });
    txList.push({ id: 2, description: 'Submit Proposal' });
    return txList.map((tx) => {
      return (
        <Box id={tx.id} key={tx.id} mb={6} _last={{ mb: 0 }}>
          <Flex
            direction='row'
            justifyContent='space-between'
            alignItems='center'
          >
            <Text color='white'>{tx.description}</Text>
            <Box>
              {tx.open ? (
                <Icon as={Spinner} name='check' color='white' />
              ) : (
                <Icon
                  as={RiCheckboxCircleLine}
                  name='check'
                  color='green.500'
                />
              )}
              <Link
                href={'https://etherscan.io/tx/' + tx.id}
                target='_blank'
                ml={2}
              >
                <Icon as={RiExternalLinkLine} name='transaction link' />
              </Link>
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
        bg='blackAlpha.800'
        borderWidth='1px'
        borderColor='whiteAlpha.200'
        py={6}
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
          {dao.address && (
            <Box pt={6}>
              <Flex direction='row' justify='space-evenly' align='center'>
                <Link to='/profile'>Profile</Link>
                <Link to='/'>Hub</Link>
              </Flex>
            </Box>
          )}
          <Box
            mx={-12}
            my={6}
            borderTopWidth='1px'
            borderTopColor='whiteAlpha.200'
          />
          <Box mb={6}>
            <Text fontSize='l' fontFamily='heading'>
              Transactions <span>will show here</span>
            </Text>
          </Box>
          <RenderTxList />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AccountModal;
