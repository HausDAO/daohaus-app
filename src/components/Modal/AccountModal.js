import React from 'react';
import {
  Link,
  Modal,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalOverlay,
  Text,
  Flex,
  Icon,
  Box,
  Spinner,
} from '@chakra-ui/core';

import { RiCheckboxCircleLine } from 'react-icons/ri';

import { useTxProcessor, useUser, useDao } from '../../contexts/PokemolContext';

import HubProfileCard from '../Hub/HubProfileCard';
import ExplorerLink from '../Shared/ExplorerLink';
import MemberInfoCardGuts from '../Dao/MemberInfoCardGuts';

const AccountModal = ({ isOpen, setShowModal }) => {
  const [user] = useUser();
  const [dao] = useDao();
  const [txProcessor] = useTxProcessor();

  // TODO: where should we put this?
  const DISPLAY_NAMES = {
    submitVote: 'Submit Vote',
    ragequit: 'ragequit',
    processProposal: 'Process Proposal',
    newDelegateKey: 'New Delegate Key',
    submitProposalV1: 'Submit Proposal',
    rageQuit: 'Rage Quit',
    cancelProposal: 'Cancel Proposal',
    processGuildKickProposal: 'Process GuildKick Proposal',
    processWhitelistProposal: 'Process Whitelist Proposal',
    ragekick: 'Rage Kick',
    sponsorProposal: 'Sponsor Proposal',
    submitProposal: 'Submit Proposal',
    submitGuildKickProposal: 'Submit GuildKick Proposal',
    submitWhitelistProposal: 'Submit Whitelist Proposal',
    withdrawBalance: 'Withdraw Balance',
    withdrawBalances: 'Withdraw Balances',
    collectTokens: 'Collect Tokens',
  };

  const RenderTxList = () => {
    const txList = txProcessor.getTxList(user.username);
    const milisecondsAgo = 86400000; // 1 day
    // dummy data
    // txList.push({
    //   id: 1,
    //   tx: '0x123',
    //   description: 'sponsorProposal',
    //   open: true,
    //   dateAdded: 1605157095244,
    // });
    // filter transactions that are more than a milisecondsAgo old
    return txList
      .filter((tx) => tx.dateAdded > Date.now() - milisecondsAgo)
      .reverse()
      .map((tx) => {
        return (
          <Box id={tx.tx} key={tx.tx} mb={6} _last={{ mb: 0 }}>
            <Flex
              direction='row'
              justifyContent='space-between'
              alignItems='center'
            >
              <Text color='white'>{DISPLAY_NAMES[tx.description]}</Text>
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
                <ExplorerLink type={'tx'} hash={tx.tx} isIconLink={true} />
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
            <MemberInfoCardGuts user={user} context={'accountModal'} />
          )}
          {dao.address && (
            <Box pt={6}>
              <Flex direction='row' justify='space-evenly' align='center'>
                <Link href='/profile'>Profile</Link>
                <Link href='/'>Hub</Link>
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
