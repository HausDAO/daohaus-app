import React, { useState } from 'react';

import Web3Service from '../../utils/Web3Service';
import ValueDisplay from '../shared/ValueDisplay';

import './MemberDetail.scss';

const web3Service = new Web3Service();

const MemberDetail = ({ member }) => {
  // TODO get profile from 3box or something
  const [s3Data] = useState({});

  const memberId = member.id.split('-')[1]
    ? member.id.split('-')[1]
    : member.id;

  return (
    <div className="MemberDetail">
      <h2>{s3Data.username}</h2>
      <p className="Data">{memberId}</p>
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
      <h5>Delegate Key</h5>
      <p className="Data">{member.delegateKey}</p>
    </div>
  );
};

export default MemberDetail;
