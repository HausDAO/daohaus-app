import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { DaoDataContext } from '../../contexts/Store';

import './ProposalEngine.scss';

const ProposalEngine = () => {
  const [daoData] = useContext(DaoDataContext);
  console.log('daoData', daoData);

  return (
    <div className="ProposalEngine">
      <h1 className="Pad">Submit Proposal</h1>
      <p>Select Proposal Type</p>
      <Link to={`/dao/${daoData.contractAddress}/proposal-member`}>Member</Link>
      <Link to={`/dao/${daoData.contractAddress}/proposal-funding`}>Funding</Link>
      <Link
        to={`/dao/${daoData.contractAddress}/proposal-whitelist`}
      >
        Whitelist Token
      </Link>
      <Link
        className="disabled-link"
        to={`/dao/${daoData.contractAddress}/proposal-guildkick`}
      >
        Guildkick (coming soon)
      </Link>
      <Link
        className="disabled-link"
        to={`/dao/${daoData.contractAddress}/proposal-trade`}
      >
        Trade (coming soon)
      </Link>
    </div>
  );
};

export default ProposalEngine;
