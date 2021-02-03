import React from 'react';
import { useParams } from 'react-router-dom';
import { Flex, Box, Skeleton, Link, Icon, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { RiExternalLinkLine } from 'react-icons/ri';

import { useDao } from '../contexts/DaoContext';
import { useMetaData } from '../contexts/MetaDataContext';
import ContentBox from './ContentBox';
import TextBox from './TextBox';
import { formatPeriods } from '../utils/general';
import { getCopy } from '../utils/metadata';

const DaoContractSettings = () => {
  const { daoOverview } = useDao();
  const { daochain, daoid } = useParams();
  const { daoMetaData } = useMetaData();
  // const [network] = useNetwork();
  // const [theme] = useTheme();

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
            {getCopy(daoMetaData, 'proposal')} Deposit
          </TextBox>
          <Skeleton isLoaded={daoOverview?.proposalDeposit}>
            <TextBox variant='value' size='xl' my={2}>
              {daoOverview?.proposalDeposit
                ? daoOverview?.proposalDeposit /
                    10 ** daoOverview?.depositToken.decimals +
                  ' ' +
                  daoOverview?.depositToken.symbol
                : '--'}
            </TextBox>
          </Skeleton>
        </Box>
        <Box>
          <TextBox size='xs'>Processing Reward</TextBox>
          <Skeleton isLoaded={daoOverview?.processingReward}>
            <TextBox variant='value' size='xl' my={2}>
              {daoOverview?.processingReward
                ? daoOverview.processingReward /
                    10 ** daoOverview?.depositToken.decimals +
                  ' ' +
                  daoOverview.depositToken.symbol
                : '--'}
            </TextBox>
          </Skeleton>
        </Box>
      </Flex>
      <Flex>
        <Box w='50%'>
          <TextBox size='xs'>Voting Period</TextBox>
          <Skeleton isLoaded={daoOverview?.votingPeriodLength}>
            <TextBox variant='value' size='xl' my={2}>
              {daoOverview
                ? `${formatPeriods(
                    +daoOverview?.votingPeriodLength,
                    +daoOverview?.periodDuration,
                  )}`
                : '--'}
            </TextBox>
          </Skeleton>
        </Box>
        <Box>
          <TextBox size='xs'>Grace Period</TextBox>
          <Skeleton isLoaded={daoOverview?.gracePeriodLength}>
            <TextBox variant='value' size='xl' my={2}>
              {daoOverview
                ? `${formatPeriods(
                    +daoOverview.gracePeriodLength,
                    +daoOverview.periodDuration,
                  )}`
                : '--'}
            </TextBox>
          </Skeleton>
        </Box>
      </Flex>
      <Flex>
        <Box w='50%'>
          <TextBox size='xs'>Summoned</TextBox>
          <Skeleton isLoaded={daoOverview?.summoningTime}>
            <TextBox variant='value' size='xl' my={2}>
              {daoOverview
                ? format(
                    new Date(+daoOverview?.summoningTime * 1000),
                    'MMMM d, yyyy',
                  )
                : '--'}
            </TextBox>
          </Skeleton>
        </Box>
        <Box>
          <TextBox size='xs'>Maximum Proposal Velocity</TextBox>
          <Skeleton isLoaded={daoOverview?.periodDuration}>
            <TextBox variant='value' size='xl' my={2}>
              {daoOverview?.periodDuration
                ? `${86400 / +daoOverview?.periodDuration} per day`
                : '--'}
            </TextBox>
          </Skeleton>
        </Box>
      </Flex>
    </ContentBox>
  );
};

export default DaoContractSettings;
