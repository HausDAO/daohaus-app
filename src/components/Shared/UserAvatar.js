import React from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import { Flex, Avatar, Box, Skeleton } from '@chakra-ui/react';

import { truncateAddr } from '../../utils/helpers';

const UserAvatar = ({ user }) => {
  return (
    <Flex direction='row' alignItems='center'>
      {user && user.image && user.image[0] ? (
        <>
          <Avatar
            name={user.username}
            src={`${'https://ipfs.infura.io/ipfs/' +
              user.image[0].contentUrl['/']}`}
            size='sm'
          />
          <Box
            ml={3}
            fontSize='sm'
            fontFamily='heading'
            d={['none', null, null, 'inline-block']}
          >
            {user.name || truncateAddr(user.username)}{' '}
            <span>{user.emoji || ''} </span>
          </Box>
        </>
      ) : (
        <>
          <Skeleton isLoaded={user?.username} m='0 auto'>
            {user.username && (
              <>
                <Avatar
                  name={user.username}
                  src={makeBlockie(user.username)}
                  size='sm'
                />
                <Box
                  fontSize='sm'
                  fontFamily='heading'
                  ml={3}
                  d={['none', null, null, 'inline-block']}
                >
                  {truncateAddr(user.username)}
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
