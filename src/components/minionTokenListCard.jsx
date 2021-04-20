import React from 'react';
import {
  Flex, Box, Skeleton, Image, useToast, Icon,
} from '@chakra-ui/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FaCopy } from 'react-icons/fa';

import { numberWithCommas } from '../utils/general';
import MinionNftTile from './minionNftTitle';

const MinionTokenListCard = ({ token }) => {
  const toast = useToast();

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
      <Flex h='60px' align='center'>
        <Box w='15%' d={['none', null, null, 'inline-block']}>
          <Skeleton isLoaded={token?.symbol}>
            <Flex align='center'>
              {token?.logoUri && (
                <Image src={token.logoUri} height='35px' mr='15px' />
              )}

              <Box fontFamily='mono'>{token?.symbol}</Box>

              <CopyToClipboard
                text={token?.contractAddress}
                onCopy={copiedToast}
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
        <Box w={['60%', null, null, '50%']}>
          <Skeleton isLoaded={token?.balance}>
            <Box fontFamily='mono'>
              {token.balance ? (
                <>
                  {`${numberWithCommas(
                    parseFloat(+token.balance / 10 ** +token.decimals).toFixed(
                      4,
                    ),
                  )} ${token.symbol}`}
                </>
              ) : null}
            </Box>
          </Skeleton>
        </Box>
        <Box w='20%' d={['none', null, null, 'inline-block']}>
          {token?.type !== 'ERC-721' && (
            <Skeleton isLoaded={token?.usd >= 0}>
              <Box fontFamily='mono'>
                {token?.usd ? (
                  <Box>{`$${numberWithCommas(token?.usd.toFixed(2))}`}</Box>
                ) : (
                  '--'
                )}
              </Box>
            </Skeleton>
          )}
        </Box>
        <Box w={['40%', null, null, '20%']}>
          {token?.type !== 'ERC-721' && (
            <Skeleton isLoaded={token?.totalUSD >= 0}>
              <Box fontFamily='mono'>
                {token?.balance ? (
                  <Box>
                    {`$${numberWithCommas(token?.totalUSD.toFixed(2))}`}
                  </Box>
                ) : (
                  '--'
                )}
              </Box>
            </Skeleton>
          )}
        </Box>
      </Flex>
      {token?.type === 'ERC-721' && (
        <Flex>
          {token.tokenURIs
            && token.tokenURIs.map((meta, idx) => (
              <MinionNftTile
                key={idx}
                tokenId={token.tokenIds[idx]}
                meta={meta}
              />
            ))}
        </Flex>
      )}
    </>
  );
};

export default MinionTokenListCard;
