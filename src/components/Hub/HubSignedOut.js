import React from 'react';
import { Box, Flex, Link } from '@chakra-ui/core';
import { Web3SignIn } from '../Shared/Web3SignIn';

const HubSignedOut = () => {
  return (
    <Box
      rounded='lg'
      bg='blackAlpha.600'
      borderWidth='1px'
      borderColor='whiteAlpha.200'
      p={6}
      m={[10, 'auto', 0, 'auto']}
      w='50%'
      textAlign='center'
    >
      <Box fontSize='3xl' fontFamily='heading' fontWeight={700} mb={10}>
        Hub
      </Box>
      <Box fontSize='md' mb={5}>
        - Notifications for all your DAOs
      </Box>
      <Box fontSize='md' mb={5}>
        - Recent activity in your DAOs
      </Box>
      <Box fontSize='md' mb={5}>
        - Switch between DAOs
      </Box>

      <Flex direction='column' align='center'>
        <Web3SignIn />

        <Link href='https://daohaus.club' isExternal>
          <Box mt={5}>Go to Daohaus</Box>
        </Link>
      </Flex>
    </Box>
  );
};

export default HubSignedOut;
