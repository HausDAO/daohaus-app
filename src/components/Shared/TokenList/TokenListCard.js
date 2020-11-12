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
      <Box w='15%'>
        <Skeleton isLoaded={isLoaded}>
          <Box fontFamily='mono'>{token?.symbol}</Box>
        </Skeleton>
      </Box>
      <Box w='55%'>
        <Skeleton isLoaded={isLoaded}>
          <Box fontFamily='mono'>
            {token?.memberBalance
              ? parseFloat(
                  utils.fromWei(token.memberBalance.toString()),
                ).toFixed(3)
              : '--'}
            {token && !token.memberBalance && token?.contractTokenBalance
              ? utils.fromWei(token.contractTokenBalance.toString())
              : null}
          </Box>
        </Skeleton>
      </Box>
      <Box w='15%'>
        <Skeleton isLoaded={isLoaded}>
          <Box fontFamily='mono'>{token?.price ? token.price : '--'}</Box>
        </Skeleton>
      </Box>
      <Box w='15%'>
        <Skeleton isLoaded={isLoaded}>
          <Box fontFamily='mono'>{token?.value ? token?.value : '--'}</Box>
        </Skeleton>
      </Box>
    </Flex>
  );
};

export default TokenListCard;
