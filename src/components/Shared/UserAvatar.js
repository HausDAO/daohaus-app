import React from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import { Flex, Avatar } from '@chakra-ui/core';

import { truncateAddr } from '../../utils/Helpers';

const UserAvatar = ({ user }) => {
  return (
    <Flex direction='row' alignItems='center'>
      {user && user.image && user.image[0] ? (
        <Avatar
          name={user.username}
          src={`${'https://ipfs.infura.io/ipfs/' +
            user.image[0].contentUrl['/']}`}
          mr={3}
        />
      ) : (
        <Avatar name={user.username} src={makeBlockie(user.username)} mr={3} />
      )}
      <h3>
        {user.name || truncateAddr(user.username)}{' '}
        <span>{user.emoji || ''} </span>
      </h3>
    </Flex>
  );
};

export default UserAvatar;
