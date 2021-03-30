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

  return (
    <Flex h='60px' align='center'>
      <Box w={'20%'} d={['none', null, null, 'inline-block']}>
        <Skeleton isLoaded={token.token.symbol}>
          <Flex align='center'>
            {token?.logoUri && (
              <Image src={token.logoUri} height='35px' mr='15px' />
            )}

            <Box fontFamily='mono'>{token.token.symbol}</Box>

            <CopyToClipboard
              text={token.token.tokenAddress}
              onCopy={() =>
                toast({
                  title: 'Copied Address',
                  position: 'top-right',
                  status: 'success',
                  duration: 3000,
                  isClosable: true,
                })
              }
            >
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
      <Box w={['45%', null, null, '45%']}>
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

      <Box w={['25%', null, null, '20%']} d={'inline-block'}>
        <Link
          to={`/dao/${token.network.networkID}/${token.moloch.id}/profile/${address}`}
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
      </Box>
    </Flex>
  );
};

export default HubBalanceListCard;
