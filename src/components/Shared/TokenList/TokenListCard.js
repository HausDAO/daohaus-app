import React, { useState } from 'react';
import { Flex, Box, Skeleton } from '@chakra-ui/core';
import UsdPrice from '../UsdPrice';
import UsdValue from '../UsdValue';
import Withdraw from '../../Forms/Withdraw';

const TokenListCard = ({ token, isLoaded, hasBalance }) => {
  const [optimisticWithdraw, setOptimisticWithdraw] = useState(false);
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
                {optimisticWithdraw ? (
                  `0.0000 ${token.token.symbol}`
                ) : (
                  <>
                    {parseFloat(
                      +token.tokenBalance / 10 ** +token.token.decimals,
                    ).toFixed(4)}{' '}
                    {token.token.symbol}
                  </>
                )}
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
            {token.tokenBalance ? (
              <>
                {optimisticWithdraw ? (
                  '$ 0.00'
                ) : (
                  <UsdValue tokenBalance={token} />
                )}
              </>
            ) : (
              '--'
            )}
          </Box>
        </Skeleton>
      </Box>

      {hasBalance && !optimisticWithdraw ? (
        <Box w='15%'>
          <Skeleton isLoaded={isLoaded}>
            <Withdraw
              tokenBalance={token}
              setOptimisticWithdraw={setOptimisticWithdraw}
            />
          </Skeleton>
        </Box>
      ) : null}
    </Flex>
  );
};

export default TokenListCard;
