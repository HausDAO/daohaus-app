import React, { useEffect, useState } from 'react';
import { Flex, Box, Skeleton, Image } from '@chakra-ui/react';

import { numberWithCommas } from '../utils/general';
import SyncTokenButton from './syncTokenButton';
import Withdraw from './withdraw';
import { useDaoMember } from '../contexts/DaoMemberContext';

const TokenListCard = ({
  token,
  isBank = true,
  version = '2.1',
  hasBalance,
  hasSync,
}) => {
  const { daoMember, delegate } = useDaoMember();
  const [needsSync, setNeedsSync] = useState(null);

  useEffect(() => {
    if (token?.contractBalances) {
      if (version === '2.1') {
        const wallet = daoMember?.hasWallet || delegate?.hasWallet;
        const isAccurateBalance =
          wallet &&
          isBank &&
          token.contractBalances.token !== token.contractBalances.babe;

        setNeedsSync(isAccurateBalance);
      } else {
        const canInteract = !!(daoMember || delegate);
        const isAccurateBalance =
          canInteract &&
          isBank &&
          +token.tokenBalance &&
          token.contractBalances.token !== token.contractBalances.babe;
        setNeedsSync(isAccurateBalance);
      }
    }
  }, [token, isBank, version, daoMember, delegate]);

  return (
    <Flex h='60px' align='center'>
      <Box
        w={hasBalance || hasSync ? '20%' : '15%'}
        d={['none', null, null, 'inline-block']}
      >
        <Skeleton isLoaded={token?.symbol}>
          <Flex align='center'>
            {token?.logoUri && (
              <Image src={token.logoUri} height='35px' mr='15px' />
            )}

            <Box fontFamily='mono'>{token?.symbol}</Box>
          </Flex>
        </Skeleton>
      </Box>
      <Box
        w={[
          hasBalance || hasSync ? '45%' : '60%',
          null,
          null,
          hasBalance || hasSync ? '45%' : '50%',
        ]}
      >
        <Skeleton isLoaded={token?.tokenBalance}>
          <Box fontFamily='mono'>
            {token.tokenBalance ? (
              <>
                {numberWithCommas(
                  parseFloat(
                    +token.tokenBalance / 10 ** +token.decimals,
                  ).toFixed(4),
                )}{' '}
                {token.symbol}
              </>
            ) : null}
          </Box>
        </Skeleton>
      </Box>
      <Box
        w={hasBalance || hasSync ? '15%' : '20%'}
        d={['none', null, null, 'inline-block']}
      >
        <Skeleton isLoaded={token?.usd >= 0}>
          <Box fontFamily='mono'>
            {token?.usd ? (
              <Box>${numberWithCommas(token?.usd.toFixed(2))}</Box>
            ) : (
              '--'
            )}
          </Box>
        </Skeleton>
      </Box>
      <Box
        w={[
          hasSync || hasBalance ? '30%' : '40%',
          null,
          null,
          hasBalance || hasSync ? '15%' : '20%',
        ]}
      >
        <Skeleton isLoaded={token?.totalUSD >= 0}>
          <Box fontFamily='mono'>
            {token?.tokenBalance ? (
              <Box>${numberWithCommas(token?.totalUSD.toFixed(2))}</Box>
            ) : (
              '--'
            )}
          </Box>
        </Skeleton>
      </Box>

      <Box
        w={['25%', null, null, '20%']}
        d={hasBalance || hasSync ? 'inline-block' : 'none'}
      >
        {hasBalance && <Withdraw token={token} />}
        {needsSync && <SyncTokenButton token={token} />}
      </Box>
    </Flex>
  );
};

export default TokenListCard;
