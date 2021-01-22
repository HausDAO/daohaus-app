import React from 'react';
import { usePrices } from '../../contexts/PokemolContext';
import { numberWithCommas } from '../../utils/helpers';

const UsdValue = ({ tokenBalance, optimisticSync }) => {
  const [prices] = usePrices();

  const checkOptimisticBalance = () => {
    return optimisticSync
      ? tokenBalance.contractBalances.token -
          tokenBalance.contractBalances.babe +
          +tokenBalance.tokenBalance
      : +tokenBalance.tokenBalance;
  };

  const price = prices[tokenBalance.token.tokenAddress]
    ? prices[tokenBalance.token.tokenAddress].price
    : 0;
  const balance = checkOptimisticBalance() / 10 ** +tokenBalance.token.decimals;

  return (
    <div>$ {numberWithCommas(parseFloat(price * balance).toFixed(2))}</div>
  );
};

export default UsdValue;
