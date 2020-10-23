import React, { useEffect, useState } from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import { getProfile } from '3box/lib/api';
import { Flex, Box } from '@chakra-ui/core';

import { truncateAddr } from '../../utils/Helpers';

const UserAvatar = ({ address }) => {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const setup = async () => {
      let proposerProfile;
      try {
        proposerProfile = await getProfile(address);
      } catch {
        proposerProfile = {};
      }
      setProfile(proposerProfile);
    };

    setup();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log('profile', profile);
  return (
    <Flex direction="row" alignItems="center">
      {profile && profile.image && profile.image[0] ? (
        <Box
          w="48px"
          h="48px"
          mr={3}
          rounded="full"
          style={{
            backgroundImage: `url(${'https://ipfs.infura.io/ipfs/' +
              profile.image[0].contentUrl['/']})`,
          }}
        >
          {''}
        </Box>
      ) : (
        <Box
          w="48px"
          h="48px"
          mr={3}
          rounded="full"
          style={{
            backgroundImage: `url("${makeBlockie(address)}")`,
          }}
        >
          {''}
        </Box>
      )}
      <h3>
        {profile.name || truncateAddr(address)}{' '}
        {profile.emoji ? <span>{profile.emoji} </span> : null}
      </h3>
    </Flex>
  );
};

export default UserAvatar;
