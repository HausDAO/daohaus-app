import React from 'react';
import { Text, Flex, Stack } from '@chakra-ui/core';

const SideNav = () => {
  return (
    <Flex direction="column">
      <Text fontSize="l" mt="30px">
        DAOhaus
      </Text>
      <Text fontSize="xs">Change Dao</Text>
      <Stack spacing={5} mt="200px" pr="20">
        <Text fontSize="xs">Main Menu</Text>
        <Text fontSize="3xl">Quests</Text>
        <Text fontSize="3xl">Inventory</Text>
        <Text fontSize="3xl">Players</Text>
        <Text fontSize="m">Boost</Text>
        <Text fontSize="m">Settings</Text>
        <Text fontSize="m">Stats</Text>
      </Stack>
    </Flex>
  );
};

export default SideNav;
