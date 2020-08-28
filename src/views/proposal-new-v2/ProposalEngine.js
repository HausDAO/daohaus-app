import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { DaoDataContext, BoostContext } from '../../contexts/Store';
import styled from 'styled-components';

const ProposalEngineDiv = styled.div`
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  h1 {
    margin-top: 50px;
  }
  p {
    margin-bottom: 50px;
  }
  a {
    display: block;
    text-align: center;
    margin: 25px auto;
    font-size: 1.35em;
    font-weight: 700;
  }
`;

const ProposalEngine = () => {
  const [daoData] = useContext(DaoDataContext);
  const [boosts] = useContext(BoostContext);

  console.log('boosts', boosts);

  return (
    <ProposalEngineDiv>
      <h1 style={{ textAlign: 'center' }}>Submit Proposal</h1>
      <p>Select a Proposal Type to continue</p>
      <Link to={`/dao/${daoData.contractAddress}/proposal-member`}>Member</Link>
      <Link to={`/dao/${daoData.contractAddress}/proposal-funding`}>
        Funding
      </Link>
      <Link to={`/dao/${daoData.contractAddress}/proposal-whitelist`}>
        Whitelist Token
      </Link>
      <Link to={`/dao/${daoData.contractAddress}/proposal-guildkick`}>
        Guildkick
      </Link>
      <Link to={`/dao/${daoData.contractAddress}/proposal-trade`}>Trade</Link>

      {boosts.transmutation ? (
        <Link to={`/dao/${daoData.contractAddress}/proposal-transmutation`}>
          Transmutation Proposal
        </Link>
      ) : null}
    </ProposalEngineDiv>
  );
};

export default ProposalEngine;
