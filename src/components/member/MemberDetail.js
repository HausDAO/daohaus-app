import React, { useState, useEffect, useContext } from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import { getProfile } from '3box/lib/api';
import styled from 'styled-components';

import Web3Service from '../../utils/Web3Service';
import ValueDisplay from '../shared/ValueDisplay';

import { DataP, DataH2 } from '../../App.styles';
import {
  MemberCardIdentityDiv,
  MemberCardImage,
  ProfileImgCard,
  OfferDivMemberCard,
} from './Member.styles';
import { DaoDataContext } from '../../contexts/Store';
import { GET_METADATA } from '../../utils/Queries';
import { withApollo } from 'react-apollo';

const MemberDetailDiv = styled.div`
  padding: 25px 25px 120px;
`;

const web3Service = new Web3Service();

const MemberDetail = ({ member, client }) => {
  const [memberProfile, setMemberProfile] = useState({});
  const [daoData] = useContext(DaoDataContext);

  const { totalShares } = client.cache.readQuery({
    query: GET_METADATA,
  });

  const parsedMemberId = member.id.split('-')[1]
    ? member.id.split('-')[1]
    : member.id;

  const memberId = member.memberAddress || parsedMemberId;

  useEffect(() => {
    const setup = async () => {
      let profile;
      try {
        profile = await getProfile(memberId);
      } catch {
        profile = {};
      }
      setMemberProfile(profile);
    };

    setup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalDaoShares =
    +daoData.version === 2 ? +member.moloch.totalShares : +totalShares;
  const votingPower = ((member.shares / totalDaoShares) * 100).toFixed();

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
                backgroundImage: `url("${makeBlockie(memberId)}")`,
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
      <DataP>{memberId}</DataP>
      {member.delegateKey !== memberId && (
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

export default withApollo(MemberDetail);
