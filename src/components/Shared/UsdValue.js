import React from 'react';
import { usePrices } from '../../contexts/PokemolContext';

const UsdValue = ({ tokenBalance, optimisticSync }) => {
  const [prices] = usePrices();

  const checkOptimisticBalance = () => {
    const optimisticBalance =
      tokenBalance.contractTokenBalance -
      tokenBalance.contractBabeBalance +
      +tokenBalance.tokenBalance;

    return optimisticSync ? optimisticBalance : +tokenBalance.tokenBalance;
  };

  const price = prices[tokenBalance.token.tokenAddress]
    ? prices[tokenBalance.token.tokenAddress].usd
    : 0;
  const balance = checkOptimisticBalance() / 10 ** +tokenBalance.token.decimals;

  return <div>$ {parseFloat(price * balance).toFixed(2)}</div>;
};

export default UsdValue;
