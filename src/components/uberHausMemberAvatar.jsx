import React from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';

import { Flex, Avatar, useToast, Icon, Text } from '@chakra-ui/react';
import { truncateAddr } from '../utils/general';

const UberHausMemberAvatar = React.memo(
  ({ addr, metadata, hideCopy = false }) => {
    const toast = useToast();

    const renderImage = addr => {
      if (metadata.avatarImg) {
        return `https://ipfs.infura.io/ipfs/${metadata.avatarImg}`;
      }
      return makeBlockie(addr);
    };

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
          <Avatar name={addr} src={renderImage(addr)} size='sm' />
          <Flex>
            <Text fontSize='sm' fontFamily='heading' ml={3}>
              {metadata?.name || truncateAddr(addr)}
            </Text>
            {hideCopy || (
              <CopyToClipboard text={addr} mr={4} onCopy={copiedToast}>
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
  },
);

export default UberHausMemberAvatar;
