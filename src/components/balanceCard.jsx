import React, { useEffect, useState } from 'react';
import { Flex, Box, Skeleton, Image, useToast, Icon } from '@chakra-ui/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';

import { numberWithCommas } from '../utils/general';
import SyncTokenButton from './syncTokenButton';
import Withdraw from './withdraw';
import { useDaoMember } from '../contexts/DaoMemberContext';

const balanceCard = ({ token, isBank = true, hasBalance }) => {
  const toast = useToast();
  const { daoMember, delegate } = useDaoMember();
  const [needsSync, setNeedsSync] = useState(null);

  useEffect(() => {
    if (token?.contractBalances) {
      const wallet = daoMember?.hasWallet || delegate?.hasWallet;
      const isAccurateBalance =
        wallet &&
        isBank &&
        token.contractBalances.token !== token.contractBalances.babe;

      setNeedsSync(isAccurateBalance);
    }
  }, [token, isBank, daoMember, delegate]);

  const copiedToast = () => {
    toast({
      title: 'Copied Address',
      position: 'top-right',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Flex h='60px' align='center'>
      <Box w='20%' d={['none', null, null, 'inline-block']}>
        <Skeleton isLoaded={token?.symbol}>
          <Flex align='center'>
            {token?.logoUri && (
              <Image src={token.logoUri} height='35px' mr='15px' />
            )}

            <Box fontFamily='mono'>{token?.symbol}</Box>

            <CopyToClipboard text={token?.tokenAddress} onCopy={copiedToast}>
              <Icon
                as={FaCopy}
                color='secondary.300'
                ml={2}
                _hover={{ cursor: 'pointer' }}
              />
            </CopyToClipboard>
          </Flex>
        </Skeleton>
      </Box>
      <Box w={['25%', null, null, '40%']}>
        <Skeleton isLoaded={token?.tokenBalance}>
          <Box fontFamily='mono'>
            {token?.tokenBalance ? (
              <>
                {`${numberWithCommas(
                  parseFloat(
                    +token.tokenBalance / 10 ** +token.decimals,
                  ).toFixed(4),
                )} ${token.symbol}`}
              </>
            ) : null}
          </Box>
        </Skeleton>
      </Box>
      <Box w='20%' d={['none', null, null, 'inline-block']}>
        <Skeleton isLoaded={token?.usd >= 0}>
          <Box fontFamily='mono'>
            {token?.usd ? (
              <Box>{`$${numberWithCommas(token?.usd.toFixed(2))}`}</Box>
            ) : (
              '--'
            )}
          </Box>
        </Skeleton>
      </Box>
      <Box w={['20%', null, null, '30%']}>
        <Skeleton isLoaded={token?.totalUSD >= 0}>
          <Box fontFamily='mono'>
            {token?.tokenBalance ? (
              <Box>{`$${numberWithCommas(token?.totalUSD.toFixed(2))}`}</Box>
            ) : (
              '--'
            )}
          </Box>
        </Skeleton>
      </Box>

      <Box w={['15%', null, null, '30%']} d='inline-block'>
        {hasBalance && <Withdraw token={token} />}
        {needsSync && <SyncTokenButton token={token} />}
      </Box>
    </Flex>
  );
};

export default balanceCard;
