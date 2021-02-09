import React from 'react';
import { useParams } from 'react-router-dom';
import { Flex, Box, Skeleton, Link, Icon, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { RiExternalLinkLine } from 'react-icons/ri';

import ContentBox from './ContentBox';
import TextBox from './TextBox';
import { formatPeriods } from '../utils/general';
import { getCopy } from '../utils/metadata';

const DaoContractSettings = ({ overview, customTerms }) => {
  const { daochain, daoid } = useParams();

  const uri = () => {
    switch (daochain) {
      case '0x1': {
        return `https://etherscan.io/address/`;
      }
      case '0x2a': {
        return `https://kovan.etherscan.io/address/`;
      }
      case '0x4': {
        return `https://rinkeby.etherscan.io/address/`;
      }
      case '0x64': {
        return `https://blockscout.com/poa/xdai/address/`;
      }
      default: {
        return `https://etherscan.io/address/`;
      }
    }
  };

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
            href={`${uri()}${daoid}`}
            target='_blank'
            rel='noreferrer noopener'
          >
            <Flex color='secondary.400' align='center'>
              {daoid || '--'}
              <Icon as={RiExternalLinkLine} color='secondary.400' ml={1} />
            </Flex>
          </Text>
        </Skeleton>
      </Box>
      <Flex mt={3}>
        <Box w='50%'>
          <TextBox size='xs'>
            {getCopy(customTerms, 'proposal')} Deposit
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
      <Flex>
        <Box w='50%'>
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
      <Flex>
        <Box w='50%'>
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
      </Flex>
    </ContentBox>
  );
};

export default DaoContractSettings;
