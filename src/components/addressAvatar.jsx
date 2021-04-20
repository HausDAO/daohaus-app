import React, { useEffect, useRef, useState } from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';

import {
  Flex, Avatar, Box, useToast, Icon, Text,
} from '@chakra-ui/react';
import { truncateAddr } from '../utils/general';
import { handleGetProfile } from '../utils/3box';

const AddressAvatar = React.memo(({
  addr,
  hideCopy = false,
  // alwaysShowName,
}) => {
  const toast = useToast();
  const [profile, setProfile] = useState(null);
  // const [hasFetched, setHasFetched] = useState(false);

  const hasFetched = useRef(false);
  useEffect(() => {
    let shouldUpdate = true;
    const getProfile = async () => {
      try {
        hasFetched.current = true;
        // console.log('fired');
        const localProfile = await handleGetProfile(addr);
        if (shouldUpdate) {
          if (profile.status === 'error') {
            setProfile(false);
            return;
          }
          setProfile(localProfile);
        }
      } catch (error) {
        console.log("Member doesn't have a profile");
        hasFetched.current = true;
      }
    };

    if (addr && !hasFetched.current) {
      getProfile();
    }
    return () => {
      shouldUpdate = false;
    };
  }, [addr]);

  const renderAvatarImage = (renderAddr) => {
    if (profile?.image?.length) {
      return `https://ipfs.infura.io/ipfs/${profile?.image[0].contentUrl['/']}`;
    }
    if (profile === false) {
      return makeBlockie(renderAddr);
    }
    return null;
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
        {addr && hasFetched && (
          <Avatar name={addr} src={renderAvatarImage(addr)} size='sm' />
        )}
        <Flex>
          <Text fontSize='sm' fontFamily='heading' ml={3}>
            {profile?.name || profile?.ens || truncateAddr(addr)}
          </Text>
          <Box as='span' mx={1}>
            {profile?.emoji && profile.emoji}
          </Box>
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
});

export default AddressAvatar;
