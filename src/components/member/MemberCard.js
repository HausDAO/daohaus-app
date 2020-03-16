import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import makeBlockie from 'ethereum-blockies-base64';
import { getProfile } from '3box/lib/api';
import styled from 'styled-components';

import Web3Service from '../../utils/Web3Service';
import { truncateAddr } from '../../utils/Helpers';
import ValueDisplay from '../shared/ValueDisplay';
import { DaoServiceContext, DaoDataContext } from '../../contexts/Store';

import { appDark, appLight, phone, primary } from '../../variables.styles';
import { DataP, DataH2 } from '../../App.styles';
import {
  MemberCardIdentityDiv,
  MemberCardImage,
  ProfileImgCard,
  OfferDivMemberCard,
} from './Member.styles';
import { withApollo } from 'react-apollo';
import { GET_METADATA } from '../../utils/Queries';

const MemberCardDiv = styled.div`
  background-color: ${appLight};
  color: black;
  margin-top: 25px;
  border-top: 2px solid ${appDark};
  border-bottom: 2px solid ${appDark};
  transition: all 0.15s linear;
  padding: 25px;

  @media (min-width: ${phone}) {
    width: 320px;
    border: 2px solid ${appDark};
    margin-bottom: 25px;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }

  &:hover {
    background-color: ${primary};
    color: white;
    @media (min-width: $phone) {
      scale: 1.05;
    }
  }

  h3 {
    margin: 10px 0px;
  }

  .VotePower {
    margin-left: 25px;
  }
`;

const MemberAddr = styled(DataP)`
  margin-bottom: 10px;
`;

const web3Service = new Web3Service();

const MemberCard = ({ member, client }) => {
  const [daoService] = useContext(DaoServiceContext);
  const [daoData] = useContext(DaoDataContext);
  const [memberProfile, setMemberProfile] = useState({});

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
    <Link
      className="MemberLink"
      to={{
        pathname: '/dao/' + daoService.daoAddress + '/member/' + member.id,
      }}
    >
      <MemberCardDiv>
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
            <h3>
              {memberProfile.name || 'unknown'}{' '}
              {memberProfile.emoji ? <span>{memberProfile.emoji} </span> : null}
            </h3>
            <MemberAddr>{truncateAddr(memberId)}</MemberAddr>
          </div>
        </MemberCardIdentityDiv>
        <OfferDivMemberCard>
          <div>
            <h5>Shares</h5>
            <DataH2>{member.shares}</DataH2>
          </div>
          {+daoData.version !== 2 ? (
            <div>
              <h5>Tribute</h5>
              <DataH2>
                <ValueDisplay
                  value={web3Service.fromWei(member.tokenTribute)}
                />
              </DataH2>
            </div>
          ) : null}
          <div className="VotePower">
            <h5>Vote Power</h5>
            <DataH2>{votingPower} %</DataH2>
          </div>
        </OfferDivMemberCard>
      </MemberCardDiv>
    </Link>
  );
};

export default withApollo(MemberCard);
