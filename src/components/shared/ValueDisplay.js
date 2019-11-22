import React from 'react';
import { withApollo } from 'react-apollo';

import SymbolIcon from './SymbolIcon';
import { GET_METADATA } from '../../utils/Queries';

const ValueDisplay = ({ value, client }) => {
  const { tokenSymbol } = client.cache.readQuery({
    query: GET_METADATA,
  });

  const showSymbol = () => {
    return tokenSymbol !== 'WETH' && tokenSymbol !== 'DAI';
  };

  return (
    <>
      <SymbolIcon tokenSymbol={tokenSymbol} />
      {value}
      {showSymbol() ? tokenSymbol : null}
    </>
  );
};

export default withApollo(ValueDisplay);
