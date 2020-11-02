import React, { useContext, useState } from 'react';
import { Text, Flex, Stack, Link, Box } from '@chakra-ui/core';
import { PokemolContext } from '../../contexts/PokemolContext';

const SideNav = () => {
  const { state } = useContext(PokemolContext);
  return (
    <Flex direction="column" p={5}>
      <Flex direction="row" align="center">
        <Box w="60px">
          <img
            src={state.theme.images.brandImg}
            width="60px"
            height="60px"
            style={{ cursor: 'pointer' }}
          />
        </Box>
        <Flex direction="column" align="left" ml={3}>
          <Text fontSize="l">DAOhaus</Text>
          <Link fontSize="xs">Change Dao</Link>
        </Flex>
      </Flex>
      <Stack spacing={5} mt={200} pl={5} pr={5}>
        <Link fontSize="xs">Main Menu</Link>
        <Link fontSize="3xl">Quests</Link>
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
