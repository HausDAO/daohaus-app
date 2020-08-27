import React from 'react';
import styled from 'styled-components';

import { phone } from '../../variables.styles';
import RageCard from './RageCard';

const RageListDiv = styled.div`
  @media (min-width: ${phone}) {
    display: flex;
    justify-content: space-evenly;
    align-content: flex-start;
    flex-wrap: wrap;
  }
`;

const RageList = ({ rages }) => {
  const renderList = () => {
    return rages.map((rage) => {
      return <RageCard rage={rage} key={rage.id} />;
    });
  };

  return <RageListDiv>{renderList()}</RageListDiv>;
};

export default RageList;
