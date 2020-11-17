import React from 'react';
import { usePrices } from '../../contexts/PokemolContext';

const UsdPrice = ({ tokenBalance }) => {
  const [prices] = usePrices();

  return (
    <div>
      ${' '}
      {prices[tokenBalance.token.tokenAddress]
        ? parseFloat(prices[tokenBalance.token.tokenAddress].usd).toFixed(2)
        : '0'}
    </div>
  );
};

export default UsdPrice;
