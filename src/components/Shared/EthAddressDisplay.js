import { Box } from '@chakra-ui/core';
import React, { useEffect, useState } from 'react';
import { useEns } from '../../contexts/PokemolContext';
import { truncateAddr } from '../../utils/helpers';

const EthAddressDisplay = ({ address }) => {
  const [ens] = useEns();
  const [currentAddress, setCurrentAddress] = useState();
  useEffect(() => {
    if (!ens.provider || !address) {
      return;
    }
    const getDisplayAddress = async (addr) => {
      try {
        const name = await ens.provider.lookupAddress(addr);
        setCurrentAddress(name ? truncateAddr(name) : truncateAddr(addr));
      } catch {
        setCurrentAddress(truncateAddr(addr));
      }
    };
    getDisplayAddress(address);
  }, [ens, address]);

  return <Box>{currentAddress}</Box>;
};

export default EthAddressDisplay;
