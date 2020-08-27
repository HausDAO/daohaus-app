import React from 'react';
import styled from 'styled-components';

import { phone, getAppDark, getAppLight } from '../../variables.styles';
import { formatCreatedAt } from '../../utils/Helpers';
import AddressProfileDisplay from '../shared/AddressProfileDisplay';

const RageCardDiv = styled.div`
  background-color: ${(props) => getAppLight(props.theme)};
  color: ${(props) => props.theme.baseFontColor};
  margin-top: 25px;
  border-top: 2px solid ${(props) => getAppDark(props.theme)};
  border-bottom: 2px solid ${(props) => getAppDark(props.theme)};
  transition: all 0.15s linear;
  padding: 25px;

  @media (min-width: ${phone}) {
    width: 320px;
    border: 2px solid ${(props) => getAppDark(props.theme)};
    margin-bottom: 25px;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }

  h3 {
    margin: 10px 0px;
  }
`;

const RageCard = ({ rage }) => {
  return (
    <>
      <RageCardDiv>
        <AddressProfileDisplay address={rage.memberAddress} />
        <h3>Raged on {formatCreatedAt(rage.createdAt)}</h3>
        {+rage.shares > 0 ? <p>Shares: {rage.shares}</p> : null}
        {+rage.loot > 0 ? <p>Loot: {rage.loot}</p> : null}
      </RageCardDiv>
    </>
  );
};

export default RageCard;
