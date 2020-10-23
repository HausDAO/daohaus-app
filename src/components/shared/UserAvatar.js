import React from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import { Flex, Box } from '@chakra-ui/core';

import { truncateAddr } from '../../utils/Helpers';

const UserAvatar = ({ user }) => {
  return (
    <Flex direction="row" alignItems="center">
      {user && user.image && user.image[0] ? (
        <Box
          w="48px"
          h="48px"
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
          w="48px"
          h="48px"
          mr={3}
          rounded="full"
          style={{
            backgroundImage: `url("${makeBlockie(user.username)}")`,
          }}
        >
          {''}
        </Box>
      )}
      <h3>
        {user.name || truncateAddr(user.username)}{' '}
        <span>{user.emoji || ''} </span>
      </h3>
    </Flex>
  );
};

export default UserAvatar;
