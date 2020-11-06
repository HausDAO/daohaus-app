import React from 'react';
import { Box, Flex, Link, Text } from '@chakra-ui/core';
import { Web3SignIn } from '../Shared/Web3SignIn';
import { useTheme } from '../../contexts/PokemolContext';

const HubSignedOut = () => {
  const [theme] = useTheme();
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
      <Text
        fontSize='3xl'
        fontFamily={theme.fonts.heading}
        fontWeight={700}
        mb={10}
      >
        Hub
      </Text>
      <Text fontSize='md' mb={5}>
        - Notifications for all your DAOs
      </Text>
      <Text fontSize='md' mb={5}>
        - Recent activity in your DAOs
      </Text>
      <Text fontSize='md' mb={5}>
        - Switch between DAOs
      </Text>

      <Flex direction='column' align='center'>
        <Web3SignIn />

        <Link href='https://daohaus.club' isExternal>
          <Text mt={5}>Go to Daohaus</Text>
        </Link>
      </Flex>
    </Box>
  );
};

export default HubSignedOut;
