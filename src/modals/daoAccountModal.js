import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Modal,
  Text,
  Flex,
  Link,
  Box,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/react';

import HubProfileCard from '../components/hubProfileCard';
import { useOverlay } from '../contexts/OverlayContext';
import { useDaoMember } from '../contexts/DaoMemberContext';
import MemberInfoGuts from '../components/memberInfoGuts';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import RenderTxList from '../components/renderTxList';

const DaoAccountModal = () => {
  const { daoAccountModal, setDaoAccountModal } = useOverlay();
  const { daoMember, isMember } = useDaoMember();
  const { address, disconnectDapp, requestWallet } = useInjectedProvider();
  const { daoid, daochain } = useParams();

  const handleClose = () => {
    setDaoAccountModal(false);
  };

  const handleSwitchWallet = () => {
    setDaoAccountModal(false);
    disconnectDapp();
    requestWallet();
  };

  return (
    <Modal isOpen={daoAccountModal} onClose={handleClose} isCentered>
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
          {isMember ? (
            <MemberInfoGuts member={daoMember} showMenu={false} />
          ) : (
            <HubProfileCard />
          )}
          <Box
            mx={-6}
            mt={6}
            mb={0}
            borderTopWidth='1px'
            borderTopColor='whiteAlpha.200'
          />
          <Box pt={6}>
            <Flex direction='row' justify='space-between' align='flex-start'>
              <Flex direction='column'>
                {address && daochain && daoid && (
                  <Link
                    as={RouterLink}
                    to={`/dao/${daochain}/${daoid}/profile/${address}`}
                    onClick={handleClose}
                    color='secondary.400'
                    _hover={{ color: 'secondary.600' }}
                    mb='4px'
                  >
                    View Member Profile
                  </Link>
                )}
                <Link
                  onClick={handleSwitchWallet}
                  color='secondary.400'
                  _hover={{ color: 'secondary.600' }}
                >
                  Connect a different wallet
                </Link>
              </Flex>

              <Link
                color='secondary.400'
                _hover={{ color: 'secondary.600' }}
                as={RouterLink}
                to='/'
                onClick={handleClose}
              >
                Go to Hub
              </Link>
            </Flex>
          </Box>
          <Box
            mx={-6}
            my={6}
            borderTopWidth='1px'
            borderTopColor='whiteAlpha.200'
          />
          <Box mb={6}>
            <Text fontSize='l' fontFamily='heading'>
              Transactions <span>will show here</span>
            </Text>
          </Box>
          {/* <RenderTxList /> */}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DaoAccountModal;
