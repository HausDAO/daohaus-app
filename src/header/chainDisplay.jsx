import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';

const ChainDisplay = () => {
  const { injectedChain } = useInjectedProvider();

  const [chainName, setChainName] = useState(null);
  console.log(chainName);
  useEffect(() => {
    if (injectedChain?.network) {
      setChainName(injectedChain?.network);
    }
  }, [injectedChain]);

  return (
    <Box fontSize='md' mr={5} as='i' fontWeight={200} color='black'>
      {chainName}
    </Box>
  );
};

export default ChainDisplay;
