import React from 'react';
import { Spinner } from '@chakra-ui/core';

import { useProposals } from '../../contexts/PokemolContext';
import ProposalsList from '../../components/Proposals/ProposalsList';

const Proposals = () => {
  const [proposals] = useProposals();

  // return <div>{!proposals.length ? <Spinner /> : <ProposalsList />}</div>;

  return <ProposalsList />;
};

export default Proposals;
