import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Flex, Link } from '@chakra-ui/react';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';

// TODO: if address get rice balance/need rice addy/token service/getBalance

const DaosquareHeader = () => {
  const { address } = useInjectedProvider();
  const [riceBalance, setRiceBalance] = useState('0');

  useEffect(() => {
    if (address) {
      setRiceBalance('420');
      console.log('riceBalance', riceBalance);
    }
  }, [address]);

  return (
    <Flex direction='row' justify='space-between' w='100%' p={6}>
      <Link as={RouterLink} to='/daosquare-incubator'>
        CCOs
      </Link>
      <Link href='https://www.daosquare.io/' isExternal>
        About
      </Link>
      <Link href='https://www.daosquare.io/' isExternal>
        Apply
      </Link>
      {/* {address && (
        <Box border='1px' borderColor='gray.200' borderRadius='3'>
          {riceBalance} Rice
        </Box>
      )} */}
    </Flex>
  );
};
export default DaosquareHeader;
