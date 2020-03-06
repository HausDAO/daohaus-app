import React from 'react';
import ValueDisplay from '../shared/ValueDisplay';

import styled from 'styled-components';
import { phone, appDark } from '../../variables.styles';

const WhitelistTokenBalancesDiv = styled.div`
  max-width: 600px;
  width: 100%;
  margin: 50px auto 0px;
  > h5 {
    font-size: 1.25em;
    margin-bottom: 25px; // brokenStyle
  }
  p {
    margin: 0;
  }
  > div {
    padding: 15px;
    width: calc(100% - 30px);
    font-size: 1.35em;
    border-top: 1px solid ${appDark};
    border-left: 1px solid ${appDark};
    border-right: 1px solid ${appDark};
    @media (max-width: ${phone}) {
      border-left: 0px solid ${appDark};
      border-right: 0px solid ${appDark};
    }
    &:nth-child(odd) {
      background-color: rgba(0, 0, 0, 0.01);
    }
    &:last-child {
      border-bottom: 1px solid ${appDark};
    }
  }
`;

const WhitelistTokenBalances = (tokens) => {
  const renderList = () => {
    return tokens.tokens.map((token) => {
      return (
        <div key={token.token.tokenAddress}>
          <ValueDisplay
            value={parseFloat(
              token.tokenBalance / 10 ** +token.decimals,
            ).toFixed(4)}
            symbolOverride={token.symbol}
          />
        </div>
      );
    });
  };

  return (
    <WhitelistTokenBalancesDiv>
      <h5>Guildbank Token Balances</h5>
      {renderList()}
    </WhitelistTokenBalancesDiv>
  );
};

export default WhitelistTokenBalances;
