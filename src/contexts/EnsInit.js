import React, { useEffect } from 'react';
import { EnsService } from '../utils/ens-service';

import { useEns, useWeb3Connect } from './PokemolContext';

const EnsInit = () => {
  const [, updateEns] = useEns();
  const [web3Connect] = useWeb3Connect();

  useEffect(() => {
    initEns();

    // eslint-disable-next-line
  }, [web3Connect]);

  const initEns = async () => {
    const ensService = new EnsService();
    updateEns(ensService);
  };

  return <></>;
};

export default EnsInit;
