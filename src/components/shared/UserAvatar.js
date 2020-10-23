import React, { useEffect, useState } from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import { getProfile } from '3box/lib/api';
import { Flex } from '@chakra-ui/core';

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
      <h3>
        {profile.name || truncateAddr(address)}{' '}
        {profile.emoji ? <span>{profile.emoji} </span> : null}
      </h3>
      {profile && profile.image && profile.image[0] ? (
        <div
          style={{
            backgroundImage: `url(${'https://ipfs.infura.io/ipfs/' +
              profile.image[0].contentUrl['/']})`,
            width: '50px',
            height: '50px',
            borderRadius: '50%',
          }}
        >
          {''}
        </div>
      ) : (
        <div
          style={{
            backgroundImage: `url("${makeBlockie(address)}")`,
          }}
        >
          {''}
        </div>
      )}
    </Flex>
  );
};

export default UserAvatar;
