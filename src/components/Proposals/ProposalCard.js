import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Flex, Text, Badge } from '@chakra-ui/core';
import { utils } from 'web3';
import { formatDistanceToNow, isBefore } from 'date-fns';

import { useDao, useTheme } from '../../contexts/PokemolContext';

const ProposalCard = ({ proposal }) => {
  const [dao] = useDao();
  const [theme] = useTheme();
  let details = null;
  try {
    details =
      proposal?.details?.slice(0, 1) === '{'
        ? JSON.parse(proposal.details)
        : null;
  } catch (err) {
    console.log('json parse error:', err);
  }

  const votePeriodEnds = new Date(+proposal?.votingPeriodEnds * 1000);

  return (
    <Link to={`/dao/${dao?.address}/proposals/${proposal?.proposalId}`}>
      <Box
        rounded='lg'
        bg='blackAlpha.600'
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
            <Text
              fontWeight={700}
              fontSize='lg'
              fontFamily={theme.fonts.heading}
            >
              {details?.title ? details.title : proposal.title}
            </Text>
          </Box>
          <Flex align='center'>
            <Flex h='20px'>
              <Badge variantColor='green' mr={3}>
                {proposal?.yesVotes ? proposal.yesVotes : '-'} Yes
              </Badge>
              <Badge variantColor='red'>
                {proposal.noVotes ? proposal.noVotes : '-'} No
              </Badge>
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
            {proposal.tributeOffered ? (
              <Text
                fontSize='lg'
                fontFamily={theme.fonts.space}
                fontWeight={700}
              >
                {utils.fromWei(proposal.tributeOffered)}{' '}
                {proposal.tributeToken || 'WETH'}
              </Text>
            ) : (
              <Text
                fontSize='lg'
                fontFamily={theme.fonts.space}
                fontWeight={700}
              >
                -
              </Text>
            )}
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
            <Text fontSize='lg' fontFamily={theme.fonts.space} fontWeight={700}>
              {proposal?.sharesRequested ? proposal.sharesRequested : '-'}
            </Text>
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
            <Text fontSize='lg' fontFamily={theme.fonts.space} fontWeight={700}>
              {proposal?.lootRequested ? proposal.lootRequested : '-'}
            </Text>
          </Box>
          <Box>
            <Text
              textTransform='uppercase'
              fontSize='0.8em'
              fontFamily={theme.fonts.heading}
              fontWeight={700}
            >
              {isBefore(Date.now(), votePeriodEnds)
                ? 'Voting Period Ends'
                : 'Voting Ended'}
            </Text>
            <Text fontSize='lg' fontFamily={theme.fonts.space} fontWeight={700}>
              {votePeriodEnds > 0
                ? formatDistanceToNow(votePeriodEnds, { addSuffix: true })
                : '-'}
            </Text>
          </Box>
        </Flex>
      </Box>
    </Link>
  );
};

export default ProposalCard;
