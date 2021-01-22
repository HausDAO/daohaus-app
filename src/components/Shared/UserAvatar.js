import React from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';

import { Flex, Avatar, Box, Skeleton, useToast, Icon } from '@chakra-ui/react';

import { truncateAddr } from '../../utils/helpers';

const UserAvatar = ({ user, hideCopy }) => {
  const toast = useToast();

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
            {hideCopy !== true && (
              <CopyToClipboard
                text={user.username}
                onCopy={() =>
                  toast({
                    title: 'Copied Address',
                    position: 'top-right',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  })
                }
              >
                <Icon as={FaCopy} color='secondary.300' ml={2} />
              </CopyToClipboard>
            )}
          </Box>
        </>
      ) : (
        <>
          <Skeleton isLoaded={user?.username} m='0 auto'>
            {user.username && (
              <Flex direction='row' alignItems='center'>
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
                  {hideCopy !== true && (
                    <CopyToClipboard
                      text={user.username}
                      onCopy={() =>
                        toast({
                          title: 'Copied Address',
                          position: 'top-right',
                          status: 'success',
                          duration: 3000,
                          isClosable: true,
                        })
                      }
                    >
                      <Icon as={FaCopy} color='secondary.300' ml={2} />
                    </CopyToClipboard>
                  )}
                </Box>
              </Flex>
            )}
          </Skeleton>
        </>
      )}
    </Flex>
  );
};

export default UserAvatar;
