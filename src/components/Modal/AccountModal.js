import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
} from '@chakra-ui/react';

import { RiCheckboxCircleLine } from 'react-icons/ri';

import {
  useTxProcessor,
  useUser,
  useDao,
  useMembers,
  useModals,
} from '../../contexts/PokemolContext';
import { memberProfile } from '../../utils/helpers';
import { DISPLAY_NAMES } from '../../utils/tx-processor-helper';

import HubProfileCard from '../Hub/HubProfileCard';
import ExplorerLink from '../Shared/ExplorerLink';
import MemberInfoCardGuts from '../Shared/MemberInfoCard/MemberInfoCardGuts';

const AccountModal = ({ isOpen }) => {
  const [user] = useUser();
  const [dao] = useDao();
  const { closeModals } = useModals();

  const [txProcessor] = useTxProcessor();

  const [members] = useMembers();
  const [member, setMember] = useState(null);

  // console.log(`Member info opened in ${context}`);

  useEffect(() => {
    if (user?.memberAddress) {
      setMember(user);
    } else {
      setMember(memberProfile(members, user.username));
    }
  }, [members, user]);

  const RenderTxList = () => {
    const txList = txProcessor.getTxList(user.username);
    const milisecondsAgo = 86400000; // 1 day
    // dummy data
    // txList.push({
    //   id: 1,
    //   tx: '0x123',tails.name: 'sponsorProposal',
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
              <Text color='white'>{DISPLAY_NAMES[tx.details.name]}</Text>
              <Box>
                {tx.pendingGraph ? (
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
    <Modal isOpen={isOpen} onClose={closeModals} isCentered>
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
            <MemberInfoCardGuts
              user={user}
              member={member}
              context={'accountModal'}
              showMenu={false}
            />
          )}
          {dao.address && (
            <Box pt={6}>
              <Flex direction='row' justify='space-evenly' align='center'>
                <Link
                  as={RouterLink}
                  to={`/dao/${dao.address}/profile/${user.username}`}
                  onClick={closeModals}
                >
                  Profile
                </Link>
                <Link as={RouterLink} to='/' onClick={closeModals}>
                  Hub
                </Link>
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
