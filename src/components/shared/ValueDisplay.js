import React from 'react';

const ValueDisplay = ({ value, symbolOverride }) => {
  const symbol = symbolOverride;

  return (
    <>
      {value} {symbol}
    </>
  );
};

export default ValueDisplay;
