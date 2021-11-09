import React, { useEffect, useMemo, useRef, useState } from 'react';

import StaticAvatar from './staticAvatar';
import { handleGetENS } from '../utils/ens';
import { handleGetProfile } from '../utils/3box';
import { useUser } from '../contexts/UserContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';

const AddressAvatar = React.memo(({ addr, hideCopy }) => {
  const [profile, setProfile] = useState(null);
  const { addressProfile } = useUser(null);
  const { address } = useInjectedProvider();

  const shouldFetchENS = useRef(false);

  useEffect(() => {
    let shouldUpdate = true;
    const getProfile = async () => {
      try {
        console.log('Getting Profile');
        if (shouldUpdate) {
          let profile = addressProfile;
          if (address !== addr) {
            profile = await handleGetProfile(addr);
          }
          console.log(profile);
          console.log('Profile');
          if (!profile) {
            setProfile(false);
            shouldFetchENS.current = true;
            return;
          }
          setProfile(profile);
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
  }, [addr, addressProfile]);

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
