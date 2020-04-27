import React from 'react';
import ValueDisplay from '../shared/ValueDisplay';
import styled from 'styled-components';

import { phone, getAppDark } from '../../variables.styles';
import SyncToken from './SyncToken';

const WhitelistTokenBalancesDiv = styled.div`
  max-width: 600px;
  width: 100%;
  margin: 50px auto 0px;
  padding-bottom: 120px;
  h5 {
    font-size: 1.25em;
    margin-bottom: 25px !important;
  }
  p {
    margin: 0;
  }
  > div {
    padding: 15px;
    width: calc(100% - 30px);
    font-size: 1.35em;
    border-top: 1px solid ${(props) => getAppDark(props.theme)};
    border-left: 1px solid ${(props) => getAppDark(props.theme)};
    border-right: 1px solid ${(props) => getAppDark(props.theme)};
    @media (max-width: ${phone}) {
      border-left: 0px solid ${(props) => getAppDark(props.theme)};
      border-right: 0px solid ${(props) => getAppDark(props.theme)};
    }
    &:nth-child(odd) {
      background-color: rgba(0, 0, 0, 0.01);
    }
    &:last-child {
      border-bottom: 1px solid ${(props) => getAppDark(props.theme)};
    }
  }
`;

const WhitelistTokenBalances = (tokens) => {
  const renderList = () => {
    return tokens.tokens
      .sort((a, b) => {
        return +b.tokenBalance - a.tokenBalance;
      })
      .map((token) => {
        const needSync =
          token.contractTokenBalance !== token.contractBabeBalance;

        return (
          <div key={token.token.tokenAddress}>
            <ValueDisplay
              value={parseFloat(
                token.tokenBalance / 10 ** +token.decimals,
              ).toFixed(4)}
              symbolOverride={token.symbol}
            />
            {needSync ? <SyncToken token={token} /> : null}
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
