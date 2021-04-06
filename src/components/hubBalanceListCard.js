import React from 'react';
import { Link } from 'react-router-dom';
import { Flex, Box, Skeleton, Icon } from '@chakra-ui/react';
import { RiLoginBoxLine } from 'react-icons/ri';

import { numberWithCommas } from '../utils/general';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { chainByName } from '../utils/chain';

const HubBalanceListCard = ({ token }) => {
  const { address } = useInjectedProvider();

  return (
    <Flex h='60px' align='center'>
      <Box w={'20%'} d={['none', null, null, 'inline-block']}>
        <Flex align='center'>
          <Box fontFamily='mono'>{token.meta?.name}</Box>
        </Flex>
      </Box>
      <Box w={'20%'} d={['none', null, null, 'inline-block']}>
        <Flex align='center'>
          <Box fontFamily='mono'>{chainByName(token.meta?.network).name}</Box>
        </Flex>
      </Box>
      <Box w={'20%'} d={['none', null, null, 'inline-block']}>
        <Flex align='center'>
          <Box fontFamily='mono'>{token.token.symbol}</Box>
        </Flex>
      </Box>

      <Box w={['25%', null, null, '25%']}>
        <Skeleton isLoaded={token.tokenBalance}>
          <Box fontFamily='mono'>
            {token.tokenBalance ? (
              <>
                {numberWithCommas(
                  parseFloat(
                    +token.tokenBalance / 10 ** +token.token.decimals,
                  ).toFixed(4),
                )}{' '}
                {token.symbol}
              </>
            ) : null}
          </Box>
        </Skeleton>
      </Box>

      <Box w={['45%', null, null, '45%']} d={'inline-block'}>
        <Link
          to={`/dao/${chainByName(token.meta?.network).chainId}/${
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
      </Box>
    </Flex>
  );
};

export default HubBalanceListCard;
