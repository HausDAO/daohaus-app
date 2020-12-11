import React, { useEffect } from 'react';

import { getMainetAddresses, getUsd } from '../utils/requests';
import { useDaoGraphData, useNetwork, usePrices } from './PokemolContext';

const PriceInit = () => {
  const [network] = useNetwork();
  const [, updatePrices] = usePrices();
  const [daoGraphData] = useDaoGraphData();

  useEffect(() => {
    if (daoGraphData) {
      initPrices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daoGraphData]);

  const initPrices = async () => {
    let res = { data: {} };
    let tokens;

    try {
      let symbolAddressMap;
      if (network.chain_id !== 1) {
        const mainnetAddresses = await getMainetAddresses();

        symbolAddressMap = mainnetAddresses.reduce((map, addr) => {
          map[addr.symbol] = addr.address.toLowerCase();
          return map;
        }, {});
        const addressesMap = {};
        tokens = daoGraphData.tokenBalances
          .map((token) => {
            const currentSymbol =
              token.token.symbol === 'WXDAI' ? 'DAI' : token.token.symbol;
            const foundAddress = symbolAddressMap[currentSymbol];
            if (foundAddress) {
              addressesMap[foundAddress.toLowerCase()] =
                token.token.tokenAddress;
            }
            return symbolAddressMap[currentSymbol];
          })
          .filter((x) => x !== undefined);

        res = await getUsd(tokens.join(','));
        const mappedPrices = Object.keys(res).reduce((list, address) => {
          list[addressesMap[address.toLowerCase()]] =
            res[address.toLowerCase()];
          return list;
        }, {});

        updatePrices(mappedPrices);
      } else {
        tokens = daoGraphData.tokenBalances.map(
          (token) => token.token.tokenAddress,
        );
        res = await getUsd(tokens.join(','));
        updatePrices(res);
      }
    } catch (err) {
      console.log('price fetch err', err);
    }
  };

  return <></>;
};

export default PriceInit;
