import React, { useEffect, useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';

// TODO: if address get rice balance/need rice addy/token service/getBalance

const DaosquareHeader = () => {
  const { address } = useInjectedProvider();
  const [riceBalance, setRiceBalance] = useState('0');

  useEffect(() => {
    if (address) {
      setRiceBalance('420');
    }
  }, [address]);

  return (
    <Flex direction='row' justify='space-between' w='100%' p={6}>
      <Box>CCOs</Box>
      <Box>About</Box>
      <Box>Apply</Box>
      {address && (
        <Box border='1px' borderColor='gray.200' borderRadius='3'>
          {riceBalance}
          {' '}
          Rice
        </Box>
      )}
    </Flex>
  );
};
export default DaosquareHeader;
