import React from 'react';
import { Flex, Box, Skeleton } from '@chakra-ui/core';
import { utils } from 'web3';

// import { usePrices } from '../../contexts/PokemolContext';

const TokenListCard = ({ token, isLoaded }) => {
  // TODO deal with prices
  // TODO handle different token decimals
  // TODO token images? trust-wallet?

  return (
    <Flex h='60px' align='center'>
      <Box w='20%'>
        <Skeleton isLoaded={isLoaded}>
          <Box>{token?.symbol}</Box>
        </Skeleton>
      </Box>
      <Box w='20%'>
        <Skeleton isLoaded={isLoaded}>
          <Box fontFamily='heading'>
            {token?.contractTokenBalance
              ? utils.fromWei(token.contractTokenBalance.toString())
              : '--'}
          </Box>
        </Skeleton>
      </Box>
      <Box w='20%'>
        <Skeleton isLoaded={isLoaded}>
          <Box fontFamily='heading'>{token?.price ? token.price : '--'}</Box>
        </Skeleton>
      </Box>
      <Box>
        <Skeleton isLoaded={isLoaded}>
          <Box fontFamily='heading'>{token?.value ? token?.value : '--'}</Box>
        </Skeleton>
      </Box>
    </Flex>
  );
};

export default TokenListCard;
