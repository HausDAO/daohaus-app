import React from 'react';
import { Link } from 'react-router-dom';
import { Flex, Box, Skeleton, Image, useToast, Icon } from '@chakra-ui/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';
import { RiLoginBoxLine } from 'react-icons/ri';

import { numberWithCommas } from '../utils/general';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';

const HubBalanceListCard = ({ token }) => {
  const toast = useToast();
  const { address } = useInjectedProvider();

  console.log('token', token);

  return (
    <Flex h='60px' align='center'>
      <Box w={'20%'} d={['none', null, null, 'inline-block']}>
        <Flex align='center'>
          <Box fontFamily='mono'>{token.network.data[0].meta.name}</Box>
        </Flex>
      </Box>
      <Box w={'20%'} d={['none', null, null, 'inline-block']}>
        <Flex align='center'>
          <Box fontFamily='mono'>{token.network.name}</Box>
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
          to={`/dao/${token.network.networkID}/${token.moloch.id}/profile/${address}`}
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
