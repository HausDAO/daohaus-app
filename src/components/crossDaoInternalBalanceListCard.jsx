import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Flex, Box, Skeleton, Icon, Button, Tooltip } from '@chakra-ui/react';
import { RiLoginBoxLine } from 'react-icons/ri';

import { daoConnectedAndSameChain, numberWithCommas } from '../utils/general';
import { chainByName } from '../utils/chain';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';

const CrossDaoInternalBalanceListCard = ({
  token,
  withdraw,
  currentDaoTokens,
}) => {
  const { minion, daochain } = useParams();
  const { address, injectedChain } = useInjectedProvider();
  const [tokenWhitelisted, setTokenWhitelisted] = useState();

  useEffect(() => {
    const isWhitelisted =
      currentDaoTokens &&
      currentDaoTokens.find(daoToken => {
        return (
          token.token.tokenAddress.toLowerCase() ===
          daoToken.tokenAddress.toLowerCase()
        );
      });
    setTokenWhitelisted(!isWhitelisted);
  }, [currentDaoTokens]);

  return (
    <Flex h='60px' align='center'>
      <Box w='20%' d={['none', null, null, 'inline-block']}>
        <Flex align='center'>
          <Box fontFamily='mono'>{token.meta?.name}</Box>
        </Flex>
      </Box>
      <Box w='20%' d={['none', null, null, 'inline-block']}>
        <Flex align='center'>
          <Box fontFamily='mono'>{chainByName(token.meta?.network).name}</Box>
        </Flex>
      </Box>
      <Box w='20%' d={['none', null, null, 'inline-block']}>
        <Flex align='center'>
          <Box fontFamily='mono'>{token.token.symbol}</Box>
        </Flex>
      </Box>

      <Box w={['25%', null, null, '25%']}>
        <Skeleton isLoaded={token.tokenBalance}>
          <Box fontFamily='mono'>
            {token.tokenBalance ? (
              <>
                {`${numberWithCommas(
                  parseFloat(
                    +token.tokenBalance / 10 ** +token.token.decimals,
                  ).toFixed(4),
                )} ${token.token.symbol}`}
              </>
            ) : null}
          </Box>
        </Skeleton>
      </Box>

      <Box w={['45%', null, null, '45%']} d='inline-block'>
        {!minion ? (
          <Link
            to={`/dao/${chainByName(token.meta?.network).chain_id}/${
              token.moloch.id
            }/profile/${address}`}
          >
            Withdraw on DAO profile page
            <Icon
              as={RiLoginBoxLine}
              ml={3}
              color='secondary.500'
              h='15px'
              w='15px'
            />
          </Link>
        ) : (
          <Box>
            <Tooltip
              hasArrow
              shouldWrapChildren
              placement='bottom'
              label={
                tokenWhitelisted
                  ? 'Token must be whitelisted in the DAO'
                  : 'Pull token into this DAO'
              }
            >
              <Button
                m={6}
                onClick={() => withdraw(token, true)}
                disabled={
                  tokenWhitelisted ||
                  !daoConnectedAndSameChain(
                    address,
                    daochain,
                    injectedChain?.chainId,
                  )
                }
              >
                Pull
              </Button>
            </Tooltip>
            <Tooltip
              hasArrow
              shouldWrapChildren
              placement='bottom'
              label='Withdraw token into the minion'
            >
              <Button
                onClick={() => withdraw(token, false)}
                disabled={
                  !daoConnectedAndSameChain(
                    address,
                    daochain,
                    injectedChain?.chainId,
                  )
                }
              >
                Withdraw
              </Button>
            </Tooltip>
          </Box>
        )}
      </Box>
    </Flex>
  );
};

export default CrossDaoInternalBalanceListCard;
