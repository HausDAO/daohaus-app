import React from 'react';
import { Box, Link, List, ListItem, Text } from '@chakra-ui/core';
import { Web3SignIn } from '../Shared/Web3SignIn';

const HubSignedOut = () => {
  return (
    <Box
      rounded="lg"
      bg="blackAlpha.600"
      borderWidth="1px"
      borderColor="whiteAlpha.200"
      p={6}
      mt={6}
      w="100%"
    >
      <Text fontSize="xl">Pokemol Hub</Text>
      <List styleType="disc">
        <ListItem>Notifications for all your dAOs</ListItem>
        <ListItem>Recent activity in your dAOs</ListItem>
        <ListItem>switch between DAOs</ListItem>
      </List>

      <Web3SignIn />

      <Link href="https://daohaus.club" isExternal>
        Go to Daohaus
      </Link>
    </Box>
  );
};

export default HubSignedOut;
