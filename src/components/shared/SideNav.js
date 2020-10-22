import React from 'react';
import { Text, Flex, Stack } from '@chakra-ui/core';

const SideNav = () => {
  return (
    <Flex direction="column">
      <Stack spacing={5}>
        <Text fontSize="s">Change Dao</Text>
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
