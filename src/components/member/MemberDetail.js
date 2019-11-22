import React, { useState, useEffect } from 'react';

import Web3Service from '../../utils/Web3Service';
import { GetMetaData } from '../../utils/MemberService';
import ValueDisplay from '../shared/ValueDisplay';

import './MemberDetail.scss';

const web3Service = new Web3Service();

const MemberDetail = ({ member }) => {
  const [s3Data, setS3Data] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      let metaData = await GetMetaData(member.delegateKey);
      setS3Data(metaData);
    };

    fetchData();
  }, [member.delegateKey]);

  return (
    <div className="MemberDetail">
      <h2>{s3Data.username}</h2>
      <p className="Data">{member.id}</p>
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
