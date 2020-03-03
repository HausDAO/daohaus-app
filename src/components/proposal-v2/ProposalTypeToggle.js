import React from 'react';

import styled from 'styled-components';
import { subdued, primaryHover } from '../../variables.styles';

import './ProposalTypeToggle.scss';

const ProposalTypeToggleDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding-left: 15px;
`;

const ToggleP = styled.p`
  color: ${subdued};
  font-weight: 700;
  transition: all 0.15s linear;
  &:first-child {
    margin-right: 25px;
  }
  &:not(.active-toggle):hover {
    color: ${primaryHover};
    cursor: pointer;
  }
`;

const ProposalTypeToggle = ({ handleTypeChange, sponsored }) => {
  return (
    <ProposalTypeToggleDiv>
      <ToggleP
        className={sponsored ? 'active-toggle' : null}
        onClick={() => handleTypeChange(true)}
      >
        Live Proposals
      </ToggleP>
      <ToggleP
        className={!sponsored ? 'active-toggle' : null}
        onClick={() => handleTypeChange(false)}
      >
        Unsponsored Proposals
      </ToggleP>
    </ProposalTypeToggleDiv>
  );
};

export default ProposalTypeToggle;
