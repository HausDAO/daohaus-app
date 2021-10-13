import React, { useMemo } from 'react';
import { Flex, Avatar, Box, Text } from '@chakra-ui/react';
import makeBlockie from 'ethereum-blockies-base64';

import CopyButton from './copyButton';
import { truncateAddr } from '../utils/general';

const StaticAvatar = ({ address, avatarImg, name, hideCopy, emoji }) => {
  const blockie = useMemo(() => {
    if (address) {
      return makeBlockie(address);
    }
  }, [address]);
  const avImg = avatarImg || blockie;

  return (
    <Flex direction='row' alignItems='center'>
      <Flex direction='row' alignItems='center'>
        <Avatar name={name || address} src={avImg} size='sm' />
        <Flex>
          <Text fontSize='sm' fontFamily='heading' ml={3}>
            {name || truncateAddr(address)}
          </Text>
          <Box as='span' mx={1}>
            {emoji}
          </Box>
          {hideCopy || <CopyButton text={address} />}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default StaticAvatar;
