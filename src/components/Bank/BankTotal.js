import React, { useEffect, useState } from 'react';
import { Skeleton, Box, Text } from '@chakra-ui/react';

import { usePrices } from '../../contexts/PokemolContext';
import { getTotalBankValue } from '../../utils/bank-helpers';
import TextBox from '../Shared/TextBox';

const BankTotal = ({ tokenBalances }) => {
  const [prices] = usePrices();
  const [bankTotal, setBankTotal] = useState(0);

  useEffect(() => {
    if (tokenBalances && prices) {
      const total = getTotalBankValue(tokenBalances, prices);
      setBankTotal(total);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenBalances, prices]);

  return (
    <>
      <Skeleton isLoaded={tokenBalances?.length > 0}>
        <Text fontFamily='mono' fontSize='3xl' variant='value'>
          ${bankTotal.toFixed(2)}
        </Text>
      </Skeleton>
      <Box>
        <Skeleton isLoaded={tokenBalances?.length > 0}>
          <Box fontSize='sm' as='i' fontWeight={200}>
            {tokenBalances?.length} Tokens
          </Box>
        </Skeleton>
      </Box>
    </>
  );
};

export default BankTotal;
