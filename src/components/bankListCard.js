import React, { useState, useEffect } from 'react';
import { Flex, Box, Skeleton, Image } from '@chakra-ui/react';

// import Withdraw from '../../Forms/Withdraw';
// import SyncToken from '../../Forms/Shared/SyncToken';
// import { useMemberWallet } from '../../../contexts/PokemolContext';
// import { getMainetAddresses } from '../../../utils/requests';
import { numberWithCommas } from '../utils/general';
import SyncTokenButton from './syncTokenButton';
import { useDaoMember } from '../contexts/DaoMemberContext';

const TokenListCard = ({
  token,
  // isLoaded,
  // isMember,
  isBank = true,
  // hasAction,
  // view,
  version = '2.1',
}) => {
  // const [memberWallet] = useMemberWallet();
  const { daoMember } = useDaoMember();
  // const [hasBalance, setHasBalance] = useState(null);
  const [needsSync, setNeedsSync] = useState(null);
  const [optimisticWithdraw] = useState(false);
  const [optimisticSync, setOptimisticSync] = useState(false);
  // const [tokenMainnetAddress, setTokenMainnetAddress] = useState();

  useEffect(() => {
    if (token?.contractBalances) {
      // setHasBalance(isMember && +token.tokenBalance);
      if (version === '2.1') {
        const isAccurateBalance =
          daoMember?.hasWallet &&
          isBank &&
          token.contractBalances.token !== token.contractBalances.babe;
        setNeedsSync(isAccurateBalance);
      } else {
        const isAccurateBalance =
          daoMember &&
          isBank &&
          +token.tokenBalance &&
          token.contractBalances.token !== token.contractBalances.babe;
        setNeedsSync(isAccurateBalance);
      }
    }
  }, [token, isBank, version, daoMember]);

  // const checkOptimisticBalance = () => {
  //   return optimisticSync
  //     ? token.contractBalances.token -
  //         token.contractBalances.babe +
  //         +token.tokenBalance
  //     : +token.tokenBalance;
  // };
  // useEffect(() => {
  //   const fetchMainnetAddresses = async () => {
  //     const mainnetAddresses = await getMainetAddresses();
  //     if (token && mainnetAddresses) {
  //       mainnetAddresses.forEach((address) => {
  //         if (address?.symbol === token?.token?.symbol) {
  //           setTokenMainnetAddress(address.address);
  //         }
  //       });
  //     }
  //   };
  //   fetchMainnetAddresses();
  // }, [token]);

  return (
    <Flex h='60px' align='center'>
      <Box w='15%'>
        <Skeleton isLoaded={token?.symbol}>
          <Flex align='center'>
            {token?.logoUri && (
              <Image src={token.logoUri} height='35px' mr='15px' />
            )}

            <Box fontFamily='mono'>{token?.symbol}</Box>
          </Flex>
        </Skeleton>
      </Box>
      <Box w='55%'>
        <Skeleton isLoaded={token?.tokenBalance}>
          <Box fontFamily='mono'>
            {token.tokenBalance ? (
              <>
                {optimisticWithdraw ? (
                  `0.0000 ${token.symbol}`
                ) : (
                  <>
                    {numberWithCommas(
                      parseFloat(
                        +token.tokenBalance / 10 ** +token.decimals,
                      ).toFixed(4),
                    )}{' '}
                    {token.symbol}
                  </>
                )}
              </>
            ) : null}
          </Box>
        </Skeleton>
      </Box>
      <Box w='15%'>
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
      <Box w='15%'>
        <Skeleton isLoaded={token?.totalUSD >= 0}>
          <Box fontFamily='mono'>
            {token?.tokenBalance ? (
              <>
                {optimisticWithdraw ? (
                  '$ 0.00'
                ) : (
                  <Box>${numberWithCommas(token?.totalUSD.toFixed(2))}</Box>
                )}
              </>
            ) : (
              '--'
            )}
          </Box>
        </Skeleton>
      </Box>
      {/* {hasAction ? (
        <Box w='15%'>
          {hasBalance && !optimisticWithdraw ? (
            <Skeleton isLoaded={isLoaded}>
              <Withdraw
                tokenBalance={token}
                setOptimisticWithdraw={setOptimisticWithdraw}
              />
            </Skeleton>
          ) : null}
*/}
      {needsSync && !optimisticSync && (
        <SyncTokenButton token={token} setOptimisticSync={setOptimisticSync} />
      )}
    </Flex>
  );
};

export default TokenListCard;
