import React from 'react';
import { useNetwork } from '../../contexts/PokemolContext';

import { SummonContextProvider } from '../../contexts/SummonContext';
import Summon from './Summon';

const SummonWrapper = () => {
  const [network] = useNetwork();

  return (
    <SummonContextProvider>{network ? <Summon /> : null}</SummonContextProvider>
  );
};

export default SummonWrapper;
