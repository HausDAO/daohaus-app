import React, { useMemo } from 'react';
import { FaCopy } from 'react-icons/fa';
import makeBlockie from 'ethereum-blockies-base64';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { Flex, Avatar, Box, useToast, Icon, Text } from '@chakra-ui/react';
import { truncateAddr } from '../utils/general';

const StaticAvatar = ({ address, avatarImg, name, hideCopy, emoji }) => {
  const toast = useToast();
  const blockie = useMemo(() => {
    if (address) {
      return makeBlockie(address);
    }
  }, [address]);
  const copiedToast = () => {
    toast({
      title: 'Copied Address',
      position: 'top-right',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Flex direction='row' alignItems='center'>
      <Flex direction='row' alignItems='center'>
        <Avatar name={name || address} src={avatarImg || blockie} size='sm' />
        <Flex>
          <Text fontSize='sm' fontFamily='heading' ml={3}>
            {name || truncateAddr(address)}
          </Text>
          <Box as='span' mx={1}>
            {emoji}
          </Box>
          {hideCopy || (
            <CopyToClipboard text={address} mr={4} onCopy={copiedToast}>
              <Icon
                transform='translateY(2px)'
                as={FaCopy}
                color='secondary.300'
                ml={2}
                _hover={{ cursor: 'pointer' }}
              />
            </CopyToClipboard>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default StaticAvatar;
