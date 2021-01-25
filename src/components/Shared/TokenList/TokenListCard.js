import React, { useEffect, useState } from 'react';
import { Flex, Box, Skeleton, Image } from '@chakra-ui/react';

import UsdPrice from '../UsdPrice';
import UsdValue from '../UsdValue';
import Withdraw from '../../Forms/Withdraw';
import SyncToken from '../../Forms/Shared/SyncToken';
import { useMemberWallet } from '../../../contexts/PokemolContext';
import { getMainetAddresses } from '../../../utils/requests';
import { numberWithCommas } from '../../../utils/helpers';

const TokenListCard = ({
  token,
  isLoaded,
  isMember,
  isBank,
  hasAction,
  version,
}) => {
  const [memberWallet] = useMemberWallet();
  const [hasBalance, setHasBalance] = useState();
  const [needsSync, setNeedsSync] = useState();
  const [optimisticWithdraw, setOptimisticWithdraw] = useState(false);
  const [optimisticSync, setOptimisticSync] = useState(false);
  const [tokenMainnetAddress, setTokenMainnetAddress] = useState();

  useEffect(() => {
    setHasBalance(isMember && +token.tokenBalance > 0);
    if (version === '2.1') {
      setNeedsSync(
        memberWallet &&
          memberWallet.activeMember &&
          isBank &&
          token.contractBalances.token !== token.contractBalances.babe,
      );
    } else {
      setNeedsSync(
        memberWallet &&
          memberWallet.activeMember &&
          isBank &&
          +token.tokenBalance > 0 &&
          token.contractBalances.token !== token.contractBalances.babe,
      );
    }
  }, [token, isMember, isBank, version, memberWallet]);

  const checkOptimisticBalance = () => {
    return optimisticSync
      ? token.contractBalances.token -
          token.contractBalances.babe +
          +token.tokenBalance
      : +token.tokenBalance;
  };

  useEffect(() => {
    const fetchMainnetAddresses = async () => {
      const mainnetAddresses = await getMainetAddresses();
      if (token && mainnetAddresses) {
        mainnetAddresses.forEach((address) => {
          if (address?.symbol === token?.token?.symbol) {
            setTokenMainnetAddress(address.address);
          }
        });
      }
    };
    fetchMainnetAddresses();
  }, [token]);

  const tokenImageUrl = tokenMainnetAddress
    ? `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${tokenMainnetAddress}/logo.png`
    : null;

  return (
    <Flex h='60px' align='center'>
      <Box w='15%'>
        <Skeleton isLoaded={isLoaded}>
          <Flex align='center'>
            {tokenMainnetAddress && (
              <Image src={tokenImageUrl} height='35px' mr='15px' />
            )}
            <Box fontFamily='mono'>{token?.token?.symbol}</Box>
          </Flex>
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
                    {numberWithCommas(
                      parseFloat(
                        checkOptimisticBalance() / 10 ** +token.token.decimals,
                      ).toFixed(4),
                    )}{' '}
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
                  <UsdValue
                    tokenBalance={token}
                    optimisticSync={optimisticSync}
                  />
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
