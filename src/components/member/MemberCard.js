import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

import Web3Service from '../../utils/Web3Service';
import { truncateAddr } from '../../utils/Helpers';
import { GetMetaData } from '../../utils/MemberService';
import ValueDisplay from '../shared/ValueDisplay';

import './MemberCard.scss';
import { DaoContext } from '../../contexts/Store';

const web3Service = new Web3Service();

const MemberCard = ({ member }) => {
  const [s3Data, setS3Data] = useState({});
  const [daoService] = useContext(DaoContext);
  useEffect(() => {
    const fetchData = async () => {
      //let metaData = await GetMetaData(member.delegateKey);
      //setS3Data(metaData);
      setS3Data({});
    };

    fetchData();
  }, [member.delegateKey]);
  const memberId = member.id.split('-')[1];
  return (
    <Link
      className="MemberLink"
      to={{
        pathname: '/dao/' + daoService.contractAddr + '/member/' + member.id,
      }}
    >
      <div className="MemberCard">
        <h3>{s3Data.username || 'unknown'}</h3>
        <p className="Data Addr">{truncateAddr(memberId)}</p>
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
