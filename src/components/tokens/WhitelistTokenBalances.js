import React from 'react';
import ValueDisplay from '../shared/ValueDisplay';

const WhiteListTokenBalances = (tokens) => {
  const renderList = () => {
    return tokens.tokens.map((token) => {
      return (
        <div key={token.token.tokenAddress}>
          <ValueDisplay
            value={parseFloat(token.tokenBalance).toFixed(4)}
            symbolOverride={token.symbol}
          />
        </div>
      );
    });
  };

  return (
    <div className="WhiteListTokenBalances">
      <h5>Guildbank Token Balances</h5>
      {renderList()}
    </div>
  );
};

export default WhiteListTokenBalances;
