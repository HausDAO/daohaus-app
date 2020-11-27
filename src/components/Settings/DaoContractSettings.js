import React from 'react';
import { Flex, Box, Skeleton, Link, Icon, Text } from '@chakra-ui/core';
import { useDao } from '../../contexts/PokemolContext';
import { useTheme } from '../../contexts/CustomThemeContext';
import { utils } from 'web3';
import { format } from 'date-fns';
import { RiExternalLinkLine } from 'react-icons/ri';

import ContentBox from '../Shared/ContentBox';
import TextBox from '../Shared/TextBox';
import { formatPeriods } from '../../utils/helpers';

const DaoContractSettings = () => {
  const [dao] = useDao();
  const [theme] = useTheme();

  const uri = () => {
    switch (process.env.REACT_APP_NETWORK_ID) {
      case '1': {
        return `https://etherscan.io/address/`;
      }
      case '42': {
        return `https://kovan.etherscan.io/address/`;
      }
      case '4': {
        return `https://rinkeby.etherscan.io/address/`;
      }
      case '100': {
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
        <TextBox>Dao Contract</TextBox>
        <Skeleton isLoaded={dao?.address}>
          <Text
            fontFamily='mono'
            variant='value'
            fontSize='sm'
            as={Link}
            href={`${uri()}${dao.address}`}
            target='_blank'
            rel='noreferrer noopener'
          >
            <Flex color='secondary.400' align='center'>
              {dao?.address ? dao?.address : '--'}
              <Icon as={RiExternalLinkLine} color='secondary.400' ml={1} />
            </Flex>
          </Text>
        </Skeleton>
      </Box>
      <Flex mt={3}>
        <Box w='50%'>
          <TextBox>{theme.daoMeta.proposal} Deposit</TextBox>
          <Skeleton isLoaded={dao?.graphData?.proposalDeposit}>
            <TextBox variant='value' my={2}>
              {dao?.graphData?.proposalDeposit
                ? utils.fromWei(dao.graphData.proposalDeposit) +
                  ' ' +
                  dao.graphData.depositToken.symbol
                : '--'}
            </TextBox>
          </Skeleton>
        </Box>
        <Box>
          <TextBox>Period Length</TextBox>
          <Skeleton isLoaded={dao?.graphData?.periodDuration}>
            <TextBox variant='value' my={2}>
              {dao?.graphData?.periodDuration
                ? `${86400 / +dao?.graphData?.periodDuration} per day`
                : '--'}
            </TextBox>
          </Skeleton>
        </Box>
      </Flex>
      <Flex>
        <Box w='50%'>
          <TextBox>Voting Period</TextBox>
          <Skeleton isLoaded={dao?.graphData}>
            <TextBox variant='value' my={2}>
              {dao?.graphData
                ? `${formatPeriods(
                    +dao?.graphData?.votingPeriodLength,
                    +dao?.graphData?.periodDuration,
                  )}`
                : '--'}
            </TextBox>
          </Skeleton>
        </Box>
        <Box>
          <TextBox>Grace Period</TextBox>
          <Skeleton isLoaded={dao?.graphData}>
            <TextBox variant='value' my={2}>
              {dao?.graphData
                ? `${formatPeriods(
                    +dao?.graphData?.gracePeriodLength,
                    +dao?.graphData?.periodDuration,
                  )}`
                : '--'}
            </TextBox>
          </Skeleton>
        </Box>
      </Flex>
      <Flex>
        <Box>
          <TextBox>Summoned</TextBox>
          <Skeleton isLoaded={dao?.createdAt}>
            <TextBox variant='value' my={2}>
              {dao?.createdAt
                ? format(new Date(+dao?.createdAt), 'MMMM d, yyyy')
                : '--'}
            </TextBox>
          </Skeleton>
        </Box>
      </Flex>
    </ContentBox>
  );
};

export default DaoContractSettings;
