import React from 'react';
import { Skeleton, Text, Box } from '@chakra-ui/react';
import { useToken } from '../contexts/TokenContext';
import { tallyUSDs } from '../utils/tokenValue';
import { numberWithCommas } from '../utils/general';
const BankTotal = ({ customBank }) => {
  const { currentDaoTokens } = useToken();

  const bankTotal = currentDaoTokens ? tallyUSDs(currentDaoTokens) : 'Loading';

  return (
    <>
      <Skeleton isLoaded={currentDaoTokens?.length > 0}>
        <Text fontFamily='mono' fontSize='3xl' variant='value'>
          ${bankTotal && numberWithCommas(bankTotal)}
        </Text>
      </Skeleton>
      <Box>
        <Skeleton isLoaded={currentDaoTokens?.length > 0}>
          <Box fontSize='sm' as='i' fontWeight={200}>
            {currentDaoTokens?.length} Token
            {currentDaoTokens?.length > 1 ? 's' : null}
          </Box>
        </Skeleton>
      </Box>
    </>
  );
};

export default BankTotal;
