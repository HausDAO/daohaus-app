import React from 'react';
import { Flex, Box, Skeleton } from '@chakra-ui/core';
import UsdPrice from '../UsdPrice';
import UsdValue from '../UsdValue';

const TokenListCard = ({ token, isLoaded }) => {
  // TODO token images? trust-wallet?
  return (
    <Flex h='60px' align='center'>
      <Box w='15%'>
        <Skeleton isLoaded={isLoaded}>
          <Box fontFamily='mono'>{token?.token?.symbol}</Box>
        </Skeleton>
      </Box>
      <Box w='55%'>
        <Skeleton isLoaded={isLoaded}>
          <Box fontFamily='mono'>
            {token.tokenBalance ? (
              <>
                {parseFloat(
                  +token.tokenBalance / 10 ** +token.token.decimals,
                ).toFixed(4)}{' '}
                {token.token.symbol}
              </>
            ) : null}
          </Box>
        </Skeleton>
      </Box>
      <Box w='15%'>
        <Skeleton isLoaded={isLoaded}>
          <Box fontFamily='mono'>
            {token.tokenBalance ? <UsdPrice tokenBalance={token} /> : '--'}
          </Box>
        </Skeleton>
      </Box>
      <Box w='15%'>
        <Skeleton isLoaded={isLoaded}>
          <Box fontFamily='mono'>
            {token.tokenBalance ? <UsdValue tokenBalance={token} /> : '--'}
          </Box>
        </Skeleton>
      </Box>
    </Flex>
  );
};

export default TokenListCard;
