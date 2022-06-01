import React, { useEffect, useState } from 'react';

import AddressAvatar from './addressAvatar';
import StaticAvatar from './staticAvatar';
import { truncateAddr } from '../utils/general';
import { fetchMetaData } from '../utils/metadata';

const EntityAvatar = React.memo(({ member }) => {
  const [loading, setLoading] = useState(false);
  const [memberMeta, setMemberMeta] = useState();

  useEffect(() => {
    const fetchMeta = async () => {
      setLoading(true);
      if (member.isDao) {
        const [meta] = await fetchMetaData(member.memberAddress);
        setMemberMeta(meta);
      }
      if (member.isSafeMinion) {
        if (member.isSafeMinion.minions.length === 1) {
          const [meta] = await fetchMetaData(
            member.isSafeMinion.minions[0].molochAddress,
          );
          setMemberMeta(meta);
        } else {
          setMemberMeta(member.isSafeMinion);
        }
      }
      setLoading(false);
    };
    if (member.isDao || member.isSafeMinion) {
      fetchMeta();
    }
  }, []);

  return loading ? (
    <AddressAvatar addr={member.memberAddress} hideCopy />
  ) : (
    <StaticAvatar
      address={member.memberAddress}
      avatarImg={
        memberMeta?.avatarImg &&
        `https://ipfs.infura.io/ipfs/${memberMeta.avatarImg}`
      }
      name={memberMeta?.name || `Minion: ${truncateAddr(member.memberAddress)}`}
      hideCopy
    />
  );
});

export default EntityAvatar;
