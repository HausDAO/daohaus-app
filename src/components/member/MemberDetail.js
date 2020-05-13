import React, { useState, useEffect, useContext } from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import { getProfile } from '3box/lib/api';
import styled from 'styled-components';

import Web3Service from '../../utils/Web3Service';
import ValueDisplay from '../shared/ValueDisplay';
import { DaoDataContext } from '../../contexts/Store';

import { DataP, DataH2 } from '../../App.styles';
import {
  MemberCardIdentityDiv,
  MemberCardImage,
  ProfileImgCard,
  OfferDivMemberCard,
} from './Member.styles';

const MemberDetailDiv = styled.div`
  padding: 25px 25px 120px;
`;

const web3Service = new Web3Service();

const MemberDetail = ({ member, client }) => {
  const [memberProfile, setMemberProfile] = useState({});
  const [daoData] = useContext(DaoDataContext);

  useEffect(() => {
    const setup = async () => {
      let profile;
      try {
        profile = await getProfile(member.memberAddress);
      } catch {
        profile = {};
      }
      setMemberProfile(profile);
    };

    setup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const votingPower = (
    (member.shares / +member.moloch.totalShares) *
    100
  ).toFixed(1);

  return (
    <MemberDetailDiv>
      <MemberCardIdentityDiv>
        <MemberCardImage>
          {memberProfile && memberProfile.image && memberProfile.image[0] ? (
            <ProfileImgCard
              style={{
                backgroundImage: `url(${'https://ipfs.infura.io/ipfs/' +
                  memberProfile.image[0].contentUrl['/']})`,
              }}
            >
              {''}
            </ProfileImgCard>
          ) : (
            <ProfileImgCard
              style={{
                backgroundImage: `url("${makeBlockie(member.memberAddress)}")`,
              }}
            >
              {''}
            </ProfileImgCard>
          )}
        </MemberCardImage>
        <div>
          <h2>{memberProfile.name}</h2>
        </div>
      </MemberCardIdentityDiv>
      <h5>Member Address</h5>
      <DataP>{member.memberAddress}</DataP>
      {member.delegateKey !== member.memberAddress && (
        <>
          <h5>Delegate Key</h5>
          <DataP>{member.delegateKey}</DataP>
        </>
      )}
      <OfferDivMemberCard>
        <div>
          <h5>Shares</h5>
          <DataH2>{member.shares}</DataH2>
        </div>
        {+daoData.version !== 2 ? (
          <div>
            <h5>Tribute</h5>
            <DataH2>
              <ValueDisplay value={web3Service.fromWei(member.tokenTribute)} />
            </DataH2>
          </div>
        ) : null}
        <div>
          <h5>Vote Power</h5>
          <DataH2>{votingPower} %</DataH2>
        </div>
      </OfferDivMemberCard>
    </MemberDetailDiv>
  );
};

export default MemberDetail;
