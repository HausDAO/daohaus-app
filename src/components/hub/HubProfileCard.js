import React, { useContext } from 'react';
import { Box, Flex, Text } from '@chakra-ui/core';

import { PokemolContext } from '../../contexts/PokemolContext';
import makeBlockie from 'ethereum-blockies-base64';
import { truncateAddr } from '../../utils/Helpers';

const HubProfileCard = () => {
  const { state } = useContext(PokemolContext);

  console.log('state', state);

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
      <Flex direction="row" alignItems="center">
        {state.user.image && state.user.image[0] ? (
          <Box
            w="100px"
            h="100px"
            mr={3}
            rounded="full"
            style={{
              backgroundImage: `url(${'https://ipfs.infura.io/ipfs/' +
                state.user.image[0].contentUrl['/']})`,
            }}
          >
            {''}
          </Box>
        ) : (
          <Box
            w="100px"
            h="100px"
            mr={3}
            rounded="full"
            style={{
              backgroundImage: `url("${makeBlockie(state.user.username)}")`,
            }}
          >
            {''}
          </Box>
        )}

        <Flex direction="column">
          <Text fontSize="xl">
            {state.user.name || truncateAddr(state.user.username)}{' '}
            <span>{state.user.emoji || ''} </span>
          </Text>
          {state.user.name ? (
            <Text fontSize="m">{truncateAddr(state.user.username)}</Text>
          ) : null}
        </Flex>
      </Flex>
      <Text fontSize="m">{state.user.description}</Text>
    </Box>
  );
};

export default HubProfileCard;
