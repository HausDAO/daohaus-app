import React from 'react';
import { usePrices } from '../../contexts/PokemolContext';

const UsdValue = ({ tokenBalance }) => {
  const [prices] = usePrices();

  const price = prices[tokenBalance.token.tokenAddress]
    ? prices[tokenBalance.token.tokenAddress].usd
    : 0;
  const balance =
    tokenBalance.tokenBalance / 10 ** +tokenBalance.token.decimals;

  return <div>$ {parseFloat(price * balance).toFixed(2)}</div>;
};

export default UsdValue;
