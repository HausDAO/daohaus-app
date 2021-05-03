import React from 'react';
import { Skeleton, Text, Box } from '@chakra-ui/react';
import { tallyUSDs } from '../utils/tokenValue';
import { numberWithCommas } from '../utils/general';

const BankTotal = ({ tokenBalances }) => {
  const bankTotal =
    tokenBalances != null ? tallyUSDs(tokenBalances) : 'loading';

  return (
    <>
      <Skeleton isLoaded={tokenBalances?.length > 0}>
        <Text fontFamily='mono' fontSize='3xl' variant='value'>
          ${bankTotal !== 'loading' && numberWithCommas(bankTotal)}
        </Text>
      </Skeleton>
      <Box>
        <Skeleton isLoaded={tokenBalances?.length > 0}>
          <Box fontSize='sm' as='i' fontWeight={200}>
            {tokenBalances?.length} Token
            {tokenBalances?.length > 1 && 's'}
          </Box>
        </Skeleton>
      </Box>
    </>
  );
};

export default BankTotal;
