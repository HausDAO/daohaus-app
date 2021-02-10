import React from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';

const HubSignedOut = () => {
  const { requestWallet } = useInjectedProvider();

  return (
    <Box
      rounded='lg'
      bg='blackAlpha.600'
      borderWidth='1px'
      borderColor='whiteAlpha.200'
      p={6}
      m={[6, 'auto', 0, 'auto']}
      w={['80%', null, null, '50%']}
      textAlign='left'
    >
      <Box fontSize='3xl' fontFamily='heading' fontWeight={700} mb={10}>
        Welcome to DAOhaus and your new Hub for all Moloch DAO activity
      </Box>
      <Box fontSize='md' mb={5}>
        🚨 Keep up with notifications from all your DAOs
      </Box>
      <Box fontSize='md' mb={5}>
        🌊️️️ Easily switch between DAOs
      </Box>
      <Box fontSize='md' mb={5}>
        🔥 Explore other DAOs or Summon a New One
      </Box>

      <Flex direction='column' align='center'>
        <Button onClick={requestWallet}>Connect Wallet</Button>
      </Flex>
    </Box>
  );
};

export default HubSignedOut;
