import React from 'react';
import {
  Link,
  Modal,
  ModalContent,
  ModalOverlay,
  Box,
  Text,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/react';
import { rgba } from 'polished';

import HubProfileCard from '../components/hubProfileCard';
import { useOverlay } from '../contexts/OverlayContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useCustomTheme } from '../contexts/CustomThemeContext';
import TxList from '../components/TxList';

const HubAccountModal = () => {
  const { disconnectDapp, requestWallet } = useInjectedProvider();
  const { hubAccountModal, setHubAccountModal } = useOverlay();
  const { theme } = useCustomTheme();

  const handleClose = () => setHubAccountModal(false);
  const handleSwitchWallet = () => {
    setHubAccountModal(false);
    disconnectDapp();
    requestWallet();
  };

  return (
    <Modal isOpen={hubAccountModal} onClose={handleClose} isCentered>
      <ModalOverlay bgColor={rgba(theme.colors.background[500], 0.8)} />
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
          <HubProfileCard />
          <Link
            onClick={handleSwitchWallet}
            color='secondary.400'
            _hover={{ color: 'secondary.600' }}
          >
            Connect a different wallet
          </Link>
          <Box
            mx={-6}
            mt={6}
            mb={0}
            borderTopWidth='1px'
            borderTopColor='whiteAlpha.200'
          />
          <Box mb={6}></Box>
          <Text fontSize='l' fontFamily='heading'>
            Transactions <span>will show here</span>
          </Text>
          <TxList />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default HubAccountModal;
