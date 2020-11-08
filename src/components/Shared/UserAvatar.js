import React from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import { Flex, Avatar, Box, Skeleton } from '@chakra-ui/core';

import { useTheme } from '../../contexts/PokemolContext';
import { truncateAddr } from '../../utils/helpers';

const UserAvatar = ({ user }) => {
  const [theme] = useTheme();

  return (
    <Flex direction='row' alignItems='center'>
      {user && user.image && user.image[0] ? (
        <>
          <Avatar
            name={user.username}
            src={`${'https://ipfs.infura.io/ipfs/' +
              user.image[0].contentUrl['/']}`}
            mr={3}
            size='sm'
          />
          <Box fontSize='md' fontFamily={theme.fonts.heading}>
            {user.name || truncateAddr(user.username || user.memberAddress)}{' '}
            <span>{user.emoji || ''} </span>
          </Box>
        </>
      ) : (
        <>
          <Skeleton isLoaded={user?.username} m='0 auto'>
            {user.username && (
              <>
                <Avatar
                  name={user.username || user.memberAddress}
                  src={makeBlockie(user.username || user.memberAddress)}
                  mr={3}
                />
                <Box fontSize='md' fontFamily={theme.fonts.heading}>
                  {truncateAddr(user.username || user.memberAddress)}
                </Box>
              </>
            )}
          </Skeleton>
        </>
      )}
    </Flex>
  );
};

export default UserAvatar;
