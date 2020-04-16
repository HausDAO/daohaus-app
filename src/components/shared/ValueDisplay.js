import React from 'react';
import { withApollo } from 'react-apollo';

import SymbolIcon from './SymbolIcon';
// import { GET_METADATA } from '../../utils/Queries';

const ValueDisplay = ({ value, client, symbolOverride }) => {
  // const { tokenSymbol } = client.cache.readQuery({
  //   query: GET_METADATA,
  // });

  // const symbol = symbolOverride || tokenSymbol;
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

export default withApollo(ValueDisplay);
