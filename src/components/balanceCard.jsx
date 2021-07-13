import React, { useEffect, useMemo, useState } from 'react';
import {
  Flex,
  Box,
  Skeleton,
  Image,
  useToast,
  Icon,
  Button,
} from '@chakra-ui/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';

import { useDaoMember } from '../contexts/DaoMemberContext';
import { useOverlay } from '../contexts/OverlayContext';
import GenericModal from '../modals/genericModal';
import SyncTokenButton from './syncTokenButton';
import Withdraw from './withdraw';
import { numberWithCommas } from '../utils/general';
import { FORM } from '../data/forms';

const balanceCard = ({ token, isBank = true, hasBalance, isNativeToken }) => {
  const toast = useToast();
  const { daoMember, delegate } = useDaoMember();
  const { setGenericModal } = useOverlay();
  const [needsSync, setNeedsSync] = useState(null);

  const displayBalance = useMemo(() => {
    if (token) {
      const balanceFromWei = +token.tokenBalance / 10 ** +token.decimals;
      return numberWithCommas(
        isNativeToken ? parseFloat(balanceFromWei).toFixed(4) : balanceFromWei,
      );
    }
  }, [token]);

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
    <>
      <GenericModal
        modalId='minionSendNativeToken'
        formLego={FORM.MINION_SEND_NATIVE_TOKEN}
        formData={{
          tokenAddress: '0x00',
          // minionAddress: '',
          balance: token?.tokenBalance,
          // need type and minion address
        }}
        closeOnOverlayClick
      />

      <Flex h='60px' align='center'>
        <Box w='25%' d={['none', null, null, 'inline-block']}>
          <Skeleton isLoaded={token?.symbol}>
            <Flex align='center'>
              {token?.logoUri && (
                <Image src={token.logoUri} height='35px' mr='15px' />
              )}

              <Box fontFamily='mono'>{token?.symbol}</Box>

              {!isNativeToken && (
                <CopyToClipboard
                  text={token?.tokenAddress}
                  onCopy={copiedToast}
                >
                  <Icon
                    as={FaCopy}
                    color='secondary.300'
                    ml={2}
                    _hover={{ cursor: 'pointer' }}
                  />
                </CopyToClipboard>
              )}
            </Flex>
          </Skeleton>
        </Box>
        <Box w={['25%', null, null, '40%']}>
          <Skeleton isLoaded={token?.tokenBalance}>
            <Box fontFamily='mono'>
              {token?.tokenBalance && isNativeToken && (
                <>
                  {`${numberWithCommas(
                    +token.tokenBalance / 10 ** +token.decimals,
                  )} ${token.symbol}`}
                </>
              )}

              {displayBalance && !isNativeToken && (
                <>{`${displayBalance} ${token.symbol}`}</>
              )}
            </Box>
          </Skeleton>
        </Box>
        {!isNativeToken && (
          <>
            <Box w='15%' d={['none', null, null, 'inline-block']}>
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
                    <Box>
                      {`$${numberWithCommas(token?.totalUSD.toFixed(2))}`}
                    </Box>
                  ) : (
                    '--'
                  )}
                </Box>
              </Skeleton>
            </Box>
          </>
        )}

        <Box w={['15%', null, null, '30%']} d='inline-block'>
          {hasBalance && <Withdraw token={token} />}
          {needsSync && <SyncTokenButton token={token} />}
          {isNativeToken && token?.tokenBalance > 0 && (
            <Button
              size='md'
              variant='outline'
              ml={6}
              onClick={() => setGenericModal({ minionSendNativeToken: true })}
            >
              Send
            </Button>
          )}
        </Box>
      </Flex>
    </>
  );
};

export default balanceCard;
