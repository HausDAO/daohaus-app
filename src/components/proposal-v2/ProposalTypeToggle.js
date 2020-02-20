import React from 'react';

import './ProposalTypeToggle.scss';

const ProposalTypeToggle = ({ handleTypeChange, sponsored }) => {
  return (
    <div className="ProposalTypeToggle">
      <p
        className={sponsored ? 'active-toggle' : 'toggle'}
        onClick={() => handleTypeChange(true)}
      >
        Sponsored Proposals
      </p>
      <p
        className={!sponsored ? 'active-toggle' : 'toggle'}
        onClick={() => handleTypeChange(false)}
      >
        Unsponsored Proposals
      </p>
    </div>
  );
};

export default ProposalTypeToggle;
