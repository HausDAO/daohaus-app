import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { RiLoginBoxLine } from 'react-icons/ri';
import { Flex, Box, Skeleton, Icon } from '@chakra-ui/react';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import MinionInternalBalanceActionMenu from './minionInternalBalanceActionMenu';
import { chainByName } from '../utils/chain';
import { displayBalance } from '../utils/tokenValue';

const CrossDaoInternalBalanceListCard = ({ token, currentDaoTokens }) => {
  const { minion } = useParams();
  const { address } = useInjectedProvider();
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
    setTokenWhitelisted(!!isWhitelisted);
  }, [currentDaoTokens]);

  return (
    <Flex h='60px' align='center'>
      <Box w='30%' d={['none', null, null, 'inline-block']}>
        <Flex align='center'>
          <Box fontFamily='mono'>{token.meta?.name}</Box>
        </Flex>
      </Box>
      <Box w='15%' d={['none', null, null, 'inline-block']}>
        <Flex align='center'>
          <Box fontFamily='mono'>
            {chainByName(token.meta?.network).short_name}
          </Box>
        </Flex>
      </Box>
      <Box w='20%' d={['none', null, null, 'inline-block']}>
        <Flex align='center'>
          <Box fontFamily='mono'>{token.token.symbol}</Box>
        </Flex>
      </Box>

      <Box w={['40%', null, null, '25%']}>
        <Skeleton isLoaded={token.tokenBalance}>
          <Box fontFamily='mono'>
            {token.tokenBalance ? (
              <>
                {`${displayBalance(token.tokenBalance, token.token.decimals)} ${
                  token.token.symbol
                }`}
              </>
            ) : null}
          </Box>
        </Skeleton>
      </Box>

      <Box w={['35%', null, null, '35%']} d='inline-block'>
        {!minion ? (
          <Link
            to={`/dao/${chainByName(token.meta?.network).chain_id}/${
              token.moloch.id
            }/profile/${address}`}
          >
            Withdraw
            <Icon
              as={RiLoginBoxLine}
              ml={3}
              color='secondary.500'
              h='15px'
              w='15px'
            />
          </Link>
        ) : (
          <Box textAlign='right'>
            <MinionInternalBalanceActionMenu
              targetDao={token}
              tokenWhitelisted={tokenWhitelisted}
              token={token}
            />
          </Box>
        )}
      </Box>
    </Flex>
  );
};

export default CrossDaoInternalBalanceListCard;
