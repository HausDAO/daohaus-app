import React from 'react';
import { useParams } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { RiExternalLinkLine } from 'react-icons/ri';
import { FaCopy } from 'react-icons/fa';
import {
  Flex,
  Box,
  Skeleton,
  Link,
  Icon,
  useBreakpointValue,
  Stack,
} from '@chakra-ui/react';
import { format } from 'date-fns';

import { useOverlay } from '../contexts/OverlayContext';
import ContentBox from './ContentBox';
import TextBox from './TextBox';
import { formatPeriods, truncateAddr } from '../utils/general';
import { getTerm, getTitle } from '../utils/metadata';
import { supportedChains } from '../utils/chain';

const DaoContractSettings = ({
  overview,
  customTerms,
  wrapNZap,
  molochToken,
  transmutationContract,
}) => {
  const { daochain, daoid } = useParams();
  const daoAddress = useBreakpointValue({
    base: truncateAddr(daoid),
    md: daoid,
  });
  const { successToast } = useOverlay();

  const copiedToast = (copiedAddressText, wrapNZap) => {
    successToast({
      title: `Copied ${copiedAddressText} address!`,
      description:
        wrapNZap &&
        `ONLY SEND ${supportedChains[daochain].nativeCurrency} TO THIS ADDRESS!`,
    });
  };

  return (
    <ContentBox d='flex' w='100%' mt={2} flexDirection='column'>
      <Stack spacing={4}>
        <Flex justify='space-between'>
          <TextBox size='xs'>Dao Contract</TextBox>
          <Skeleton isLoaded={daoid}>
            <Box
              fontFamily='mono'
              variant='value'
              fontSize='sm'
              as={Link}
              href={`${supportedChains[daochain].block_explorer}/address/${daoid}`}
              target='_blank'
              rel='noreferrer noopener'
            >
              <Flex color='secondary.400' align='center'>
                <Box>{daoAddress}</Box>
                <Icon as={RiExternalLinkLine} color='secondary.400' mx={2} />
              </Flex>
            </Box>
          </Skeleton>
        </Flex>
        {wrapNZap && (
          <Flex justify='space-between'>
            <TextBox size='xs'>
              Unwrapped {supportedChains[daochain].chain} receiver (Wrap-N-Zap)
            </TextBox>
            <Box fontFamily='mono' variant='value' fontSize='sm'>
              <Flex color='secondary.400' align='center'>
                <Box>{wrapNZap}</Box>
                <CopyToClipboard
                  text={wrapNZap}
                  mx={2}
                  onCopy={() => copiedToast('Wrap-N-Zap', true)}
                  _hover={{ cursor: 'pointer' }}
                >
                  <Icon
                    as={FaCopy}
                    color='secondarytransmutationRes.transmutations[0].300'
                    ml={2}
                  />
                </CopyToClipboard>
              </Flex>
            </Box>
          </Flex>
        )}
        {molochToken && (
          <Flex justify='space-between'>
            <TextBox size='xs'>Moloch Token</TextBox>
            <Box fontFamily='mono' variant='value' fontSize='sm'>
              <Flex color='secondary.400' align='center'>
                <Box>{molochToken}</Box>
                <CopyToClipboard
                  text={molochToken}
                  mx={2}
                  onCopy={() => copiedToast('Moloch Token')}
                  _hover={{ cursor: 'pointer' }}
                >
                  <Icon
                    as={FaCopy}
                    color='secondarytransmutationRes.transmutations[0].300'
                    ml={2}
                  />
                </CopyToClipboard>
              </Flex>
            </Box>
          </Flex>
        )}
        {transmutationContract && (
          <Flex justify='space-between'>
            <TextBox size='xs'>Transmutation Contract</TextBox>
            <Box fontFamily='mono' variant='value' fontSize='sm'>
              <Flex color='secondary.400' align='center'>
                <Box>{transmutationContract}</Box>
                <CopyToClipboard
                  text={transmutationContract}
                  mx={2}
                  onCopy={copiedToast}
                  _hover={{ cursor: 'pointer' }}
                >
                  <Icon as={FaCopy} color='secondary.300' ml={2} />
                </CopyToClipboard>
              </Flex>
            </Box>
          </Flex>
        )}
        <Flex wrap='wrap'>
          <Box as={Stack} w={['100%', null, null, '50%']} spacing={2}>
            <TextBox size='xs' title={getTitle(customTerms, 'Proposal')}>
              {`${getTerm(customTerms, 'proposal')} Deposit`}
            </TextBox>
            <TextBox variant='value' size='xl'>
              {overview?.proposalDeposit
                ? `${overview?.proposalDeposit /
                    10 ** overview?.depositToken.decimals} ${
                    overview?.depositToken.symbol
                  }`
                : '--'}
            </TextBox>
          </Box>
          <Stack spacing={2}>
            <TextBox size='xs'>Processing Reward</TextBox>
            <TextBox variant='value' size='xl'>
              {overview?.processingReward
                ? `${overview.processingReward /
                    10 ** overview?.depositToken.decimals} ${
                    overview.depositToken.symbol
                  }`
                : '--'}
            </TextBox>
          </Stack>
        </Flex>
        <Flex wrap='wrap'>
          <Box as={Stack} w={['100%', null, null, '50%']} spacing={2}>
            <TextBox size='xs'>Voting Period</TextBox>
            <TextBox variant='value' size='xl' my={2}>
              {overview
                ? `${formatPeriods(
                    +overview?.votingPeriodLength,
                    +overview?.periodDuration,
                  )}`
                : '--'}
            </TextBox>
          </Box>
          <Stack spacing={2}>
            <TextBox size='xs'>Grace Period</TextBox>
            <TextBox variant='value' size='xl'>
              {overview
                ? `${formatPeriods(
                    +overview.gracePeriodLength,
                    +overview.periodDuration,
                  )}`
                : '--'}
            </TextBox>
          </Stack>
        </Flex>
        <Flex wrap='wrap'>
          <Box as={Stack} spacing={2} w={['100%', null, null, '50%']}>
            <TextBox size='xs'>Summoned</TextBox>
            <TextBox variant='value' size='xl'>
              {overview
                ? format(
                    new Date(+overview?.summoningTime * 1000),
                    'MMMM d, yyyy',
                  )
                : '--'}
            </TextBox>
          </Box>
          <Stack spacing={2}>
            <TextBox size='xs'>Maximum Proposal Velocity</TextBox>
            <TextBox variant='value' size='xl'>
              {overview?.periodDuration
                ? `${86400 / +overview?.periodDuration} per day`
                : '--'}
            </TextBox>
          </Stack>
        </Flex>
      </Stack>
    </ContentBox>
  );
};

export default DaoContractSettings;
