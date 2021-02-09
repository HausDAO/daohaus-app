import React, { useEffect, useState } from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';

import { Flex, Avatar, Box, useToast, Icon } from '@chakra-ui/react';
import { truncateAddr } from '../utils/general';
import { handleGetProfile } from '../utils/3box';

const AddressAvatar = React.memo(function AddrAvatar({
  addr,
  hideCopy = false,
  alwaysShowName,
}) {
  const toast = useToast();
  const [profile, setProfile] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  useEffect(() => {
    let shouldFetch = true;
    const getProfile = async () => {
      if (shouldFetch) {
        try {
          // console.log('fired');
          const profile = await handleGetProfile(addr);
          if (profile.status === 'error') {
            setProfile(false);
            setHasFetched(true);
            return;
          }
          setProfile(profile);
          setHasFetched(true);
        } catch (error) {
          console.log("Member doesn't have a profile");
        }
      }
    };
    if (!hasFetched) {
      getProfile();
    }
    return () => {
      shouldFetch = false;
    };
  }, [addr]);

  const renderImage = (addr) => {
    if (profile?.image?.length) {
      return `https://ipfs.infura.io/ipfs/${profile?.image[0].contentUrl['/']}`;
    } else if (profile === false) {
      return makeBlockie(addr);
    } else {
      return null;
    }
  };

  return (
    <Flex direction='row' alignItems='center'>
      <Flex direction='row' alignItems='center'>
        {addr && hasFetched && (
          <Avatar name={addr} src={renderImage(addr)} size='sm' />
        )}
        <Box
          fontSize='sm'
          fontFamily='heading'
          ml={3}
          d={[
            !alwaysShowName ? 'none' : 'inline-block',
            null,
            null,
            'inline-block',
          ]}
        >
          {profile?.name || truncateAddr(addr)}
          <Box as='span' ml={1}>
            {profile?.emoji && profile.emoji}{' '}
          </Box>
          {hideCopy || (
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
              <Icon
                as={FaCopy}
                color='secondary.300'
                ml={2}
                _hover={{ cursor: 'pointer' }}
              />
            </CopyToClipboard>
          )}
        </Box>
      </Flex>
    </Flex>
  );
});

export default AddressAvatar;
