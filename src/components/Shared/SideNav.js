import React from 'react';
import { Text, Flex, Stack, Spinner } from '@chakra-ui/core';

import { useDao, useLoading } from '../../contexts/PokemolContext';

const SideNav = () => {
  const [loading] = useLoading();
  const [dao] = useDao();

  return (
    <Flex direction="column">
      <Text fontSize="l" mt="30px">
        DAOhaus
      </Text>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {dao ? (
            <>
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
            </>
          ) : (
            <>
              <Stack spacing={5} mt="200px" pr="20">
                <Text fontSize="xs">Main Menu</Text>
                <Text fontSize="3xl">Explore DAOs</Text>
                <Text fontSize="3xl">Summon a DAO</Text>
                <Text fontSize="3xl">HausDAO</Text>
                <Text fontSize="m">About</Text>
                <Text fontSize="m">Help</Text>
              </Stack>
            </>
          )}
        </>
      )}
    </Flex>
  );
};

export default SideNav;
