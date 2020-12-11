import React from 'react';
import { usePrices } from '../../contexts/PokemolContext';
import { numberWithCommas } from '../../utils/helpers';

const UsdPrice = ({ tokenBalance }) => {
  const [prices] = usePrices();

  return (
    <div>
      ${' '}
      {prices[tokenBalance.token.tokenAddress]
        ? numberWithCommas(
            parseFloat(prices[tokenBalance.token.tokenAddress].usd).toFixed(2),
          )
        : '0'}
    </div>
  );
};

export default UsdPrice;
