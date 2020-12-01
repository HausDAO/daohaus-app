import React, { useEffect, useState } from 'react';
import { Flex, Box, Skeleton } from '@chakra-ui/core';

import UsdPrice from '../UsdPrice';
import UsdValue from '../UsdValue';
import Withdraw from '../../Forms/Withdraw';
import SyncToken from '../../Forms/SyncToken';

const TokenListCard = ({ token, isLoaded, isMember, isBank, hasAction }) => {
  const [hasBalance, setHasBalance] = useState();
  const [needsSync, setNeedsSync] = useState();
  const [optimisticWithdraw, setOptimisticWithdraw] = useState(false);
  const [optimisticSync, setOptimisticSync] = useState(null);

  useEffect(() => {
    setHasBalance(isMember && +token.tokenBalance > 0);
    setNeedsSync(
      isBank && token.contractTokenBalance !== token.contractBabeBalance,
    );
  }, [token, isMember, isBank]);

  const hasOptimisticBalance = () => {
    return optimisticSync !== null;
  };

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
            {token.tokenBalance ? (
              <UsdPrice tokenBalance={token} optimisticSync={optimisticSync} />
            ) : (
              '--'
            )}
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
      {hasAction ? (
        <Box w='15%'>
          {hasBalance && !optimisticWithdraw ? (
            <Skeleton isLoaded={isLoaded}>
              <Withdraw
                tokenBalance={token}
                setOptimisticWithdraw={setOptimisticWithdraw}
              />
            </Skeleton>
          ) : null}

          {needsSync && !optimisticSync ? (
            <Skeleton isLoaded={isLoaded}>
              <SyncToken
                tokenBalance={token}
                setOptimisticSync={setOptimisticSync}
              />
            </Skeleton>
          ) : null}
        </Box>
      ) : null}
    </Flex>
  );
};

export default TokenListCard;
