import React from 'react';

import ProposalsList from '../../components/Proposals/ProposalsList';
import { useProposals } from '../../contexts/PokemolContext';

const Proposals = () => {
  console.log('render Proposals');
  const [proposals] = useProposals();

  return <>{proposals.length ? <ProposalsList /> : null}</>;
};

export default Proposals;
