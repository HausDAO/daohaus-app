import React from 'react';
import styled from 'styled-components';

import { phone } from '../../variables.styles';

import ProposalCard from './ProposalCard';

const ProposalListDiv = styled.div`
  padding-bottom: 90px;
  @media (min-width: ${phone}) {
    display: flex;
    justify-content: space-evenly;
    align-content: flex-start;
    flex-wrap: wrap;
  }
`;

const ProposalList = ({ proposals }) => {
  const renderList = () => {
    return proposals.map((proposal, i) => {
      return <ProposalCard proposal={proposal} key={proposal.id} index={i} />;
    });
  };

  return <ProposalListDiv>{renderList()}</ProposalListDiv>;
};

export default ProposalList;
