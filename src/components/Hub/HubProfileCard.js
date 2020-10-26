import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/core';

import { useUser } from '../../contexts/PokemolContext';
import makeBlockie from 'ethereum-blockies-base64';
import { truncateAddr } from '../../utils/Helpers';

const HubProfileCard = () => {
  const [user] = useUser();

  return (
    <>
      <Flex direction="row" alignItems="center">
        {user.image && user.image[0] ? (
          <Box
            w="100px"
            h="100px"
            mr={3}
            rounded="full"
            style={{
              backgroundImage: `url(${'https://ipfs.infura.io/ipfs/' +
                user.image[0].contentUrl['/']})`,
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
              backgroundImage: `url("${makeBlockie(user.username)}")`,
            }}
          >
            {''}
          </Box>
        )}

        <Flex direction="column">
          <Text fontSize="xl">
            {user.name || truncateAddr(user.username)}{' '}
            <span>{user.emoji || ''} </span>
          </Text>
          {user.name ? (
            <Text fontSize="m">{truncateAddr(user.username)}</Text>
          ) : null}
        </Flex>
      </Flex>
      <Text fontSize="m">{user.description}</Text>
    </>
  );
};

export default HubProfileCard;
