import React, { useEffect, useMemo, useRef, useState } from 'react';

import StaticAvatar from './staticAvatar';
import { handleGetENS } from '../utils/ens';
import { handleGetProfile } from '../utils/3box';

const AddressAvatar = React.memo(({ addr, hideCopy }) => {
  const [profile, setProfile] = useState(null);

  const shouldFetchENS = useRef(false);

  useEffect(() => {
    let shouldUpdate = true;
    const getProfile = async () => {
      try {
        const localProfile = await handleGetProfile(addr);
        if (shouldUpdate) {
          if (localProfile.status === 'error') {
            setProfile(false);
            shouldFetchENS.current = true;
            return;
          }
          setProfile(localProfile);
        }
      } catch (error) {
        console.log("Member doesn't have a profile");
      }
    };
    if (addr) {
      getProfile();
    }
    return () => {
      shouldUpdate = false;
    };
  }, [addr]);

  useEffect(() => {
    const tryENS = async () => {
      shouldFetchENS.current = false;
      const result = await handleGetENS(addr);
      if (result) {
        setProfile({ name: result });
      }
    };

    if (profile === false && shouldFetchENS.current) {
      tryENS();
    }
  }, [profile, addr]);

  const avatarImage = useMemo(() => {
    if (profile?.image?.length) {
      return `https://ipfs.infura.io/ipfs/${profile?.image[0].contentUrl['/']}`;
    }
    return null;
  }, [profile, addr]);

  return (
    <StaticAvatar
      address={addr}
      avatarImg={avatarImage}
      name={profile?.name}
      hideCopy={hideCopy}
    />
  );
});

export default AddressAvatar;
