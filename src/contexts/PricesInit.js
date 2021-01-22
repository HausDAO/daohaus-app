import React, { useEffect } from 'react';

import { getApiPriceData } from '../utils/requests';
import { usePrices } from './PokemolContext';

const PriceInit = () => {
  const [, updatePrices] = usePrices();

  useEffect(() => {
    initPrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initPrices = async () => {
    try {
      const priceRes = await getApiPriceData();
      updatePrices(priceRes);
    } catch (err) {
      console.log('price fetch err', err);
    }
  };

  return <></>;
};

export default PriceInit;
