import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Flex, Text, Badge, Skeleton } from '@chakra-ui/core';
import { utils } from 'web3';
import { formatDistanceToNow, isBefore } from 'date-fns';

import { useDao, useTheme } from '../../contexts/PokemolContext';

const ProposalCard = ({ proposal, isLoaded }) => {
  const [dao] = useDao();
  const [theme] = useTheme();
  const votePeriodEnds = new Date(+proposal?.votingPeriodEnds * 1000);

  return (
    <Link to={`/dao/${dao.address}/proposals/${proposal.proposalId}`}>
      {/* <Link to={`/dao/${dao?.address}/proposals/${proposal?.proposalId}`}> */}

      <Box
        rounded='lg'
        bg='blackAlpha.800'
        borderWidth='1px'
        borderColor='whiteAlpha.200'
        p={6}
        m={6}
        mt={2}
      >
        <Flex>
          <Box minWidth='30%' mr={5}>
            <Text
              fontSize='sm'
              textTransform='uppercase'
              fontFamily={theme.fonts.heading}
            >
              {proposal?.proposalType
                ? proposal.proposalType
                : theme.daoMeta.proposal}
            </Text>
            <Skeleton isLoaded={isLoaded}>
              <Text
                fontWeight={700}
                fontSize='lg'
                fontFamily={theme.fonts.heading}
              >
                {proposal.title || '--'}
              </Text>
              <Text
                fontWeight={700}
                fontSize='lg'
                fontFamily={theme.fonts.heading}
              >
                {proposal.createdAt}
              </Text>
            </Skeleton>
          </Box>
          <Flex align='center'>
            <Flex h='20px'>
              <Skeleton isLoaded={isLoaded}>
                <Badge colorScheme='green' mr={3}>
                  {proposal?.yesVotes ? proposal.yesVotes : '--'} Yes
                </Badge>
                <Badge colorScheme='red'>
                  {proposal?.noVotes ? proposal.noVotes : '--'} No
                </Badge>
              </Skeleton>
            </Flex>
          </Flex>
        </Flex>
        <Flex w='80%' justify='space-between' mt={10}>
          <Box>
            <Text
              textTransform='uppercase'
              fontSize='sm'
              fontFamily={theme.fonts.heading}
              fontWeight={700}
            >
              Tribute
            </Text>
            <Skeleton isLoaded={isLoaded}>
              <Text
                fontSize='lg'
                fontFamily={theme.fonts.space}
                fontWeight={700}
              >
                {proposal?.tributeOffered
                  ? utils.fromWei(proposal.tributeOffered)
                  : '--'}{' '}
                {proposal.tributeToken || 'WETH'}
              </Text>
            </Skeleton>
          </Box>
          <Box>
            <Text
              textTransform='uppercase'
              fontSize='sm'
              fontFamily={theme.fonts.heading}
              fontWeight={700}
            >
              Shares
            </Text>
            <Skeleton isLoaded={isLoaded}>
              <Text
                fontSize='lg'
                fontFamily={theme.fonts.space}
                fontWeight={700}
              >
                {proposal?.sharesRequested ? proposal.sharesRequested : '--'}
              </Text>
            </Skeleton>
          </Box>
          <Box>
            <Text
              textTransform='uppercase'
              fontSize='sm'
              fontFamily={theme.fonts.heading}
              fontWeight={700}
            >
              Loot
            </Text>
            <Skeleton isLoaded={isLoaded}>
              <Text
                fontSize='lg'
                fontFamily={theme.fonts.space}
                fontWeight={700}
              >
                {proposal?.lootRequested ? proposal.lootRequested : '--'}
              </Text>
            </Skeleton>
          </Box>
          <Box>
            <Text
              textTransform='uppercase'
              fontSize='0.8em'
              fontFamily={theme.fonts.heading}
              fontWeight={700}
            >
              {votePeriodEnds
                ? isBefore(Date.now(), votePeriodEnds)
                  ? 'Voting Period Ends'
                  : 'Voting Ended'
                : 'Proposal Status'}
            </Text>
            <Skeleton isLoaded={isLoaded}>
              <Text
                fontSize='lg'
                fontFamily={theme.fonts.space}
                fontWeight={700}
              >
                {votePeriodEnds > 0
                  ? formatDistanceToNow(votePeriodEnds, { addSuffix: true })
                  : '-'}
              </Text>
            </Skeleton>
          </Box>
        </Flex>
      </Box>
    </Link>
  );
};

export default ProposalCard;
