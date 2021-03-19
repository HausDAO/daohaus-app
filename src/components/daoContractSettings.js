import React from 'react';
// import { useParams, Link as RouterLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import {
  Flex,
  Box,
  Skeleton,
  Link,
  Icon,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { RiExternalLinkLine } from 'react-icons/ri';
// import { RiExternalLinkLine, RiFireLine } from 'react-icons/ri';

import ContentBox from './ContentBox';
import TextBox from './TextBox';
import { formatPeriods, truncateAddr } from '../utils/general';
import { getTerm } from '../utils/metadata';
import { supportedChains } from '../utils/chain';

const DaoContractSettings = ({ overview, customTerms }) => {
  const { daochain, daoid } = useParams();
  const daoAddress = useBreakpointValue({
    base: truncateAddr(daoid),
    md: daoid,
  });

  return (
    <ContentBox d='flex' w='100%' mt={2} flexDirection='column'>
      <Box>
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
              {daoAddress || '--'}
              <Icon as={RiExternalLinkLine} color='secondary.400' ml={1} />
            </Flex>
          </Text>
        </Skeleton>
      </Box>
      <Flex mt={3} wrap='wrap'>
        <Box w={['100%', null, null, '50%']}>
          <TextBox size='xs'>
            {getTerm(customTerms, 'proposal')} Deposit
          </TextBox>
          <Skeleton isLoaded={overview?.proposalDeposit}>
            <TextBox variant='value' size='xl' my={2}>
              {overview?.proposalDeposit
                ? overview?.proposalDeposit /
                    10 ** overview?.depositToken.decimals +
                  ' ' +
                  overview?.depositToken.symbol
                : '--'}
            </TextBox>
          </Skeleton>
        </Box>
        <Box>
          <TextBox size='xs'>Processing Reward</TextBox>
          <Skeleton isLoaded={overview?.processingReward}>
            <TextBox variant='value' size='xl' my={2}>
              {overview?.processingReward
                ? overview.processingReward /
                    10 ** overview?.depositToken.decimals +
                  ' ' +
                  overview.depositToken.symbol
                : '--'}
            </TextBox>
          </Skeleton>
        </Box>
      </Flex>
      <Flex wrap='wrap'>
        <Box w={['100%', null, null, '50%']}>
          <TextBox size='xs'>Voting Period</TextBox>
          <Skeleton isLoaded={overview?.votingPeriodLength}>
            <TextBox variant='value' size='xl' my={2}>
              {overview
                ? `${formatPeriods(
                    +overview?.votingPeriodLength,
                    +overview?.periodDuration,
                  )}`
                : '--'}
            </TextBox>
          </Skeleton>
        </Box>
        <Box>
          <TextBox size='xs'>Grace Period</TextBox>
          <Skeleton isLoaded={overview?.gracePeriodLength}>
            <TextBox variant='value' size='xl' my={2}>
              {overview
                ? `${formatPeriods(
                    +overview.gracePeriodLength,
                    +overview.periodDuration,
                  )}`
                : '--'}
            </TextBox>
          </Skeleton>
        </Box>
      </Flex>
      <Flex wrap='wrap'>
        <Box w={['100%', null, null, '50%']}>
          <TextBox size='xs'>Summoned</TextBox>
          <Skeleton isLoaded={overview?.summoningTime}>
            <TextBox variant='value' size='xl' my={2}>
              {overview
                ? format(
                    new Date(+overview?.summoningTime * 1000),
                    'MMMM d, yyyy',
                  )
                : '--'}
            </TextBox>
          </Skeleton>
        </Box>
        <Box>
          <TextBox size='xs'>Maximum Proposal Velocity</TextBox>
          <Skeleton isLoaded={overview?.periodDuration}>
            <TextBox variant='value' size='xl' my={2}>
              {overview?.periodDuration
                ? `${86400 / +overview?.periodDuration} per day`
                : '--'}
            </TextBox>
          </Skeleton>
        </Box>
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
    </ContentBox>
  );
};

export default DaoContractSettings;
