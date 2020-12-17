import React from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';

import { Flex, Avatar, Box, useToast, Icon } from '@chakra-ui/react';

import { truncateAddr } from '../../utils/helpers';

const AddressAvatar = ({ addr, hideCopy }) => {
  const toast = useToast();

  return (
    <Flex direction='row' alignItems='center'>
      <Flex direction='row' alignItems='center'>
        <Avatar name={addr} src={makeBlockie(addr)} size='sm' />
        <Box
          fontSize='sm'
          fontFamily='heading'
          ml={3}
          d={['none', null, null, 'inline-block']}
        >
          {truncateAddr(addr)}
          {hideCopy !== true && (
            <CopyToClipboard
              text={addr}
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
    </Flex>
  );
};

export default AddressAvatar;
