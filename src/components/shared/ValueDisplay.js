import React from 'react';

import SymbolIcon from './SymbolIcon';

const ValueDisplay = ({ value, symbolOverride }) => {
  const symbol = symbolOverride;

  const showSymbol = () => {
    return symbol !== 'WETH';
  };

  return (
    <>
      <SymbolIcon tokenSymbol={symbol} />
      {value} {showSymbol() ? symbol : null}
    </>
  );
};

export default ValueDisplay;
