import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import makeBlockie from 'ethereum-blockies-base64';
import { getProfile } from '3box/lib/api';

import Web3Service from '../../utils/Web3Service';
import { truncateAddr } from '../../utils/Helpers';
import ValueDisplay from '../shared/ValueDisplay';
import { DaoServiceContext } from '../../contexts/Store';

import './MemberCard.scss';

const web3Service = new Web3Service();

const MemberCard = ({ member }) => {
  const [daoService] = useContext(DaoServiceContext);
  const [memberProfile, setMemberProfile] = useState({});

  const memberId = member.id.split('-')[1]
    ? member.id.split('-')[1]
    : member.id;

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

  return (
    <Link
      className="MemberLink"
      to={{
        pathname: '/dao/' + daoService.daoAddress + '/member/' + member.id,
      }}
    >
      <div className="MemberCard">
        <div className="MemberCard__identity">
          <div className="MemberCard__image">
            {memberProfile && memberProfile.image && memberProfile.image[0] ? (
              <div
                className="ProfileImgCard"
                style={{
                  backgroundImage: `url(${'https://ipfs.infura.io/ipfs/' +
                    memberProfile.image[0].contentUrl['/']})`,
                }}
              >
                {''}
              </div>
            ) : (
              <div
                className="ProfileImgCard"
                style={{
                  backgroundImage: `url("${makeBlockie(memberId)}")`,
                }}
              >
                {''}
              </div>
            )}
          </div>
          <div>
            <h3>
              {memberProfile.name || 'unknown'}{' '}
              {memberProfile.emoji ? <span>{memberProfile.emoji} </span> : null}
            </h3>
            <p className="Data Addr">{truncateAddr(memberId)}</p>
          </div>
        </div>
        <div className="Offer">
          <div className="Shares">
            <h5>Shares</h5>
            <h2 className="Data">{member.shares}</h2>
          </div>
          <div className="Tribute">
            <h5>Tribute</h5>
            <h2 className="Data">
              <ValueDisplay value={web3Service.fromWei(member.tokenTribute)} />
            </h2>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MemberCard;
