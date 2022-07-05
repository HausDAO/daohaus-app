import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { Flex, Box, Image, useToast, Icon } from '@chakra-ui/react';

import { useDaoMember } from '../contexts/DaoMemberContext';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import MinionTransfer from './minionTransfer';
import PokeTokenButton from './pokeTokenButton';
import SyncTokenButton from './syncTokenButton';
import Withdraw from './withdraw';
import { numberWithCommas } from '../utils/general';
import { displayBalance } from '../utils/tokenValue';
import { getWrapNZap } from '../utils/theGraph';

const balanceCard = ({
  token,
  isBank = true,
  hasBalance,
  isNativeToken,
  vault,
}) => {
  const toast = useToast();
  const { daoid, daochain, minion } = useParams();
  const { daoMember, delegate, isMember } = useDaoMember();
  const [needsSync, setNeedsSync] = useState(null);
  const [wnzAddress, setWnzAddress] = useState(null);
  const [needsPoke, setNeedsPoke] = useState(null);
  const { injectedProvider } = useInjectedProvider();

  useEffect(() => {
    if (token?.contractBalances) {
      const wallet = daoMember?.hasWallet || delegate?.hasWallet;
      const isAccurateBalance =
        wallet &&
        isBank &&
        token.contractBalances.token !== token.contractBalances.babe;

      setNeedsSync(isAccurateBalance);
    }

    const getWnzAddress = async () => {
      setWnzAddress(await getWrapNZap(daochain, daoid));
    };
    getWnzAddress();

    if (wnzAddress) {
      injectedProvider.eth.getBalance(wnzAddress, (error, result) => {
        if (error) {
          console.log('Error detecting Wrap-N-Zap poke balance.', error);
        } else {
          setNeedsPoke(result !== '0');
        }
      });
    }
  }, [daochain, daoid, daoMember, delegate, isBank, token]);

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
      <Box w='25%' d={['none', null, null, 'inline-block']}>
        <Flex align='center'>
          {token?.logoUri && (
            <Image src={token.logoUri} height='35px' mr='15px' />
          )}
          <Box fontFamily='mono'>{token?.symbol}</Box>
          {!isNativeToken && (
            <CopyToClipboard text={token?.tokenAddress} onCopy={copiedToast}>
              <Icon
                as={FaCopy}
                color='secondary.300'
                ml={2}
                _hover={{ cursor: 'pointer' }}
              />
            </CopyToClipboard>
          )}
        </Flex>
      </Box>
      <Box w={['40%', null, null, '40%']}>
        <Box fontFamily='mono'>
          {`${displayBalance(token.tokenBalance, token.decimals) || 0} ${
            token.symbol
          }`}
        </Box>
      </Box>
      {!isNativeToken && (
        <>
          <Box w='20%' d={['none', null, null, 'inline-block']}>
            <Box fontFamily='mono'>
              <Box>{`$${numberWithCommas(token?.usd?.toFixed(2)) || 0}`}</Box>
            </Box>
          </Box>
          <Box w={['25%', null, null, '30%']}>
            <Box fontFamily='mono'>
              <Box>
                {!isNaN(token?.totalUSD)
                  ? `$${numberWithCommas(token?.totalUSD?.toFixed(2)) || 0}`
                  : `$0`}
              </Box>
            </Box>
          </Box>
        </>
      )}

      <Box w={['10%', null, null, '30%']} d='inline-block' textAlign='right'>
        {hasBalance && <Withdraw token={token} />}
        {needsPoke && <PokeTokenButton wnzAddress={wnzAddress} />}
        {needsSync && <SyncTokenButton token={token} />}
        {minion && token?.tokenBalance > 0 && (
          <MinionTransfer
            daochain={daochain}
            isMember={isMember || delegate}
            isNativeToken={isNativeToken}
            minion={minion}
            token={token}
            vault={vault}
          />
        )}
      </Box>
    </Flex>
  );
};

export default balanceCard;
