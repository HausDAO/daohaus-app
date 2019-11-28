import React from 'react';
import ProposalCard from './ProposalCard';
import './ProposalList.scss';

const ProposalList = ({ proposals }) => {
  
  const renderList = () => {
    return proposals.map((proposal) => {
      return <ProposalCard proposal={proposal} key={proposal.id} />;
    });
  };

  return <div className="ProposalList">{renderList()}</div>;
};

export default ProposalList;
