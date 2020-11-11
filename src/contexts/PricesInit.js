import React, { useEffect } from 'react';

import { getUsd } from '../utils/price-api';
import { useDaoGraphData, usePrices } from './PokemolContext';

const PriceInit = () => {
  const [, updatePrices] = usePrices();
  const [daoGraphData] = useDaoGraphData();

  useEffect(() => {
    if (daoGraphData) {
      initPrices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daoGraphData]);

  const initPrices = async () => {
    const tokens = daoGraphData.tokenBalances.map(
      (token) => token.token.tokenAddress,
    );
    const res = await getUsd(tokens.join(','));

    updatePrices(res.data);
  };

  return <></>;
};

export default PriceInit;
