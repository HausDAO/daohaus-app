import React from 'react';
import { Flex, Box, Skeleton, Link, Icon } from '@chakra-ui/core';
import { useDao } from '../../contexts/PokemolContext';
import { useTheme } from '../../contexts/CustomThemeContext';
import { utils } from 'web3';
import { format } from 'date-fns';
import { RiExternalLinkLine } from 'react-icons/ri';

import ContentBox from '../Shared/ContentBox';
import TextBox from '../Shared/TextBox';

const DaoContractSettings = () => {
  const [dao] = useDao();
  const [theme] = useTheme();
  console.log(dao);

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
    <ContentBox d='flex' w='100%' flexDirection='column'>
      <Box>
        <TextBox>Dao Contract</TextBox>
        <Skeleton isLoaded={dao?.address}>
          <Link
            href={`${uri()}${dao.address}`}
            target='_blank'
            rel='noreferrer noopener'
          >
            <Flex
              fontFamily='body'
              fontSize='sm'
              color='secondary.400'
              align='center'
            >
              {dao?.address ? dao?.address : '--'}
              <Icon as={RiExternalLinkLine} color='secondary.400' ml={1} />
            </Flex>
          </Link>
        </Skeleton>
      </Box>
      <Flex mt={3}>
        <Box w='50%'>
          <Box
            textTransform='uppercase'
            fontFamily='heading'
            fontSize='sm'
            fontWeight={700}
            color='primary.50'
          >
            {theme.daoMeta.proposal} Deposit
          </Box>
          <Skeleton isLoaded={dao?.graphData?.proposalDeposit}>
            <Box fontFamily='mono' fontSize='md' fontWeight={700} my={2}>
              {dao?.graphData?.proposalDeposit
                ? utils.fromWei(dao.graphData.proposalDeposit) +
                  ' ' +
                  dao.graphData.depositToken.symbol
                : '--'}
            </Box>
          </Skeleton>
        </Box>
        <Box>
          <Box
            textTransform='uppercase'
            fontFamily='heading'
            fontSize='sm'
            fontWeight={700}
            color='primary.50'
          >
            Period Length
          </Box>
          <Box fontFamily='mono' fontSize='md' fontWeight={700} my={2}>
            20 Quests per Day
          </Box>
        </Box>
      </Flex>
      <Flex>
        <Box w='50%'>
          <Box
            textTransform='uppercase'
            fontFamily='heading'
            fontSize='sm'
            fontWeight={700}
            color='primary.50'
          >
            Voting Period
          </Box>
          <Box fontFamily='mono' fontSize='md' fontWeight={700} my={2}>
            3 days
          </Box>
        </Box>
        <Box>
          <Box
            textTransform='uppercase'
            fontFamily='heading'
            fontSize='sm'
            fontWeight={700}
            color='primary.50'
          >
            Grace Period
          </Box>
          <Box fontFamily='mono' fontSize='md' fontWeight={700} my={2}>
            2 days
          </Box>
        </Box>
      </Flex>
      <Flex>
        <Box>
          <Box
            textTransform='uppercase'
            fontFamily='heading'
            fontSize='sm'
            fontWeight={700}
            color='primary.50'
          >
            Summoned
          </Box>
          <Skeleton isLoaded={dao?.createdAt}>
            <Box fontFamily='mono' fontSize='md' fontWeight={700} my={2}>
              {dao?.createdAt
                ? format(new Date(+dao?.createdAt), 'MMMM d, yyyy')
                : '--'}
            </Box>
          </Skeleton>
        </Box>
      </Flex>
    </ContentBox>
  );
};

export default DaoContractSettings;
