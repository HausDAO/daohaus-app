import React from 'react';
import { useParams } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  Flex,
  Box,
  Skeleton,
  Link,
  Icon,
  Text,
  useBreakpointValue,
  Stack,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { RiExternalLinkLine } from 'react-icons/ri';
import { FaCopy } from 'react-icons/fa';

import ContentBox from './ContentBox';
import TextBox from './TextBox';
import { formatPeriods, truncateAddr } from '../utils/general';
import { getTerm } from '../utils/metadata';
import { supportedChains } from '../utils/chain';
import { useOverlay } from '../contexts/OverlayContext';

const DaoContractSettings = ({ overview, customTerms, wrapNZap }) => {
  const { daochain, daoid } = useParams();
  const daoAddress = useBreakpointValue({
    base: truncateAddr(daoid),
    md: daoid,
  });
  const { successToast } = useOverlay();

  const copiedToast = () => {
    successToast({
      title: 'Copied Wrap-N-Zap address!',
      description: `ONLY SEND ${supportedChains[daochain].nativeCurrency} TO THIS ADDRESS!`,
    });
  };

  return (
    <ContentBox d='flex' w='100%' mt={2} flexDirection='column'>
      <Stack spacing={4}>
        <Flex justify='space-between'>
          <TextBox size='xs'>Dao Contract</TextBox>
          <Skeleton isLoaded={daoid}>
            <Text
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
            </Text>
          </Skeleton>
        </Flex>
        {wrapNZap && (
          <Flex justify='space-between'>
            <TextBox size='xs'>
              Unwrapped {supportedChains[daochain].chain} receiver (Wrap-N-Zap)
            </TextBox>
            <Text fontFamily='mono' variant='value' fontSize='sm'>
              <Flex color='secondary.400' align='center'>
                <Box>{wrapNZap}</Box>
                <CopyToClipboard
                  text={wrapNZap}
                  mx={2}
                  onCopy={copiedToast}
                  _hover={{ cursor: 'pointer' }}
                >
                  <Icon as={FaCopy} color='secondary.300' ml={2} />
                </CopyToClipboard>
              </Flex>
            </Text>
          </Flex>
        )}
        <Flex wrap='wrap'>
          <Box as={Stack} w={['100%', null, null, '50%']} spacing={2}>
            <TextBox size='xs'>
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
          {/* <Text
          fontFamily='mono'
          variant='value'
          fontSize='sm'
          as={RouterLink}
          to={`/dao/${daochain}/${daoid}/settings/clone`}
          // target='_blank'
          // rel='noreferrer noopener'
        >
          <Flex color='secondary.400' align='center'>
            Summon a clone of this DAO
            <Icon as={RiFireLine} color='secondary.400' ml={1} />
          </Flex>
        </Text> */}
        </Flex>
      </Stack>
    </ContentBox>
  );
};

export default DaoContractSettings;
