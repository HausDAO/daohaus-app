import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { get } from '../utils/requests';

import { useDao, usePrices } from './PokemolContext';

const PriceInit = () => {
  const location = useLocation();
  const [dao] = useDao();
  const [prices, updatePrices] = usePrices();

  // useEffect(() => {
  //   var pathname = location.pathname.split('/');
  //   const daoParam = pathname[2];
  //   const regex = RegExp('0x[0-9a-f]{10,40}');
  //   const validParam =
  //     pathname[1] === 'dao' && regex.test(daoParam) ? daoParam : false;

  //   if (!validParam) {
  //     updatePrices({});
  //     return;
  //   }

  //   console.log();

  //   // if (dao && prices.daoAddress !== daoParam) {
  //   //   initPrices(daoParam);
  //   // }
  //   // eslint-disable-next-line
  // }, [location, dao]);

  const initPrices = async () => {
    console.log('^^^^^^^^^^^^^^^initPrices', dao);
  };

  return <></>;
};

export default PriceInit;
