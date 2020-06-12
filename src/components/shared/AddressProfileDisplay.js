import React, { useEffect, useState } from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import { getProfile } from '3box/lib/api';

import { truncateAddr } from '../../utils/Helpers';
import {
  MemberCardIdentityDiv,
  MemberCardImage,
  ProfileImgCard,
} from '../member/Member.styles';
import { DataP } from '../../App.styles';

const AddressProfileDisplay = ({ address }) => {
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
  return (
    <MemberCardIdentityDiv>
      <MemberCardImage>
        {profile && profile.image && profile.image[0] ? (
          <ProfileImgCard
            style={{
              backgroundImage: `url(${'https://ipfs.infura.io/ipfs/' +
                profile.image[0].contentUrl['/']})`,
            }}
          >
            {''}
          </ProfileImgCard>
        ) : (
          <ProfileImgCard
            style={{
              backgroundImage: `url("${makeBlockie(address)}")`,
            }}
          >
            {''}
          </ProfileImgCard>
        )}
      </MemberCardImage>
      <div>
        <h3>
          {profile.name || 'unknown'}{' '}
          {profile.emoji ? <span>{profile.emoji} </span> : null}
        </h3>
        <DataP>{truncateAddr(address)}</DataP>
      </div>
    </MemberCardIdentityDiv>
  );
};

export default AddressProfileDisplay;
