import React from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import { Flex, Avatar, Text } from '@chakra-ui/core';

import { useTheme } from '../../contexts/PokemolContext';
import { truncateAddr } from '../../utils/helpers';

const UserAvatar = ({ user }) => {
  const [theme] = useTheme();

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
      <Text fontSize='md' fontFamily={theme.fonts.heading}>
        {user.name || truncateAddr(user.username)}{' '}
        <span>{user.emoji || ''} </span>
      </Text>
    </Flex>
  );
};

export default UserAvatar;
