import React, { useEffect, useState } from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';

import { Flex, Avatar, Box, useToast, Icon } from '@chakra-ui/react';
import { truncateAddr } from '../utils/general';
import { handleGetProfile } from '../utils/3box';

const AddressAvatar = ({ addr, hideCopy = false }) => {
  const toast = useToast();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const profile = await handleGetProfile(addr);
        if (profile.status === 'error') {
          setProfile(null);
          return;
        }
        setProfile(profile);
      } catch (error) {
        console.log("Member doesn't have a profile");
      }
    };

    getProfile();
  }, [addr]);

  return (
    <Flex direction='row' alignItems='center'>
      <Flex direction='row' alignItems='center'>
        <Avatar
          name={addr}
          src={
            profile?.image?.length
              ? `https://ipfs.infura.io/ipfs/${profile?.image[0].contentUrl['/']}`
              : makeBlockie(addr)
          }
          size='sm'
        />
        <Box
          fontSize='sm'
          fontFamily='heading'
          ml={3}
          d={['none', null, null, 'inline-block']}
        >
          {profile?.name || truncateAddr(addr)}
          <Box as='span' ml={1}>
            {profile?.emoji && profile.emoji}{' '}
          </Box>
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
};

export default AddressAvatar;
