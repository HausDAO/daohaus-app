import React from 'react';
import { formatDistanceToNow, isBefore } from 'date-fns';
import { Flex, Box, Text, Icon, Link } from '@chakra-ui/core';
import { utils } from 'web3';

import { useUser, useTheme } from '../../contexts/PokemolContext';
import UserAvatar from '../../components/Shared/UserAvatar';

const ProposalDetail = ({ proposal }) => {
  const [user] = useUser();
  const [theme] = useTheme();
  const details = proposal.details && JSON.parse(proposal.details);
  const votePeriodEnds = new Date(+proposal.votingPeriodEnds * 1000);
  return (
    <Box
      rounded='lg'
      bg='blackAlpha.600'
      borderWidth='1px'
      borderColor='whiteAlpha.200'
      p={6}
      m={6}
    >
      <Flex>
        <Box w='90%'>
          <Text
            textTransform='uppercase'
            fontSize='sm'
            fontFamily={theme.fonts.heading}
            fontWeight={700}
          >
            {proposal.proposalType}
          </Text>
          <Text
            fontSize='3xl'
            fontFamily={theme.fonts.heading}
            fontWeight={700}
          >
            {details?.title}
          </Text>
          <Flex w='100%' justify='space-between' mt={6}>
            <Box>
              <Text
                textTransform='uppercase'
                fontSize='sm'
                fontFamily={theme.fonts.heading}
                fontWeight={700}
              >
                Tribute
              </Text>
              <Text
                fontSize='lg'
                fontFamily={theme.fonts.space}
                fontWeight={700}
              >
                {utils.fromWei(proposal.tributeOffered.toString())}{' '}
                {proposal.tributeTokenSymbol || 'WETH'}
              </Text>
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
              <Text
                fontSize='lg'
                fontFamily={theme.fonts.space}
                fontWeight={700}
              >
                {proposal.sharesRequested}
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
              <Text
                fontSize='lg'
                fontFamily={theme.fonts.space}
                fontWeight={700}
              >
                {proposal.lootRequested}
              </Text>
            </Box>
            <Box>
              <Text
                textTransform='uppercase'
                fontSize='sm'
                fontFamily={theme.fonts.heading}
                fontWeight={700}
              >
                {isBefore(Date.now(), votePeriodEnds)
                  ? 'Voting Period Ends'
                  : 'Voting Ended'}
              </Text>
              <Text
                fontSize='lg'
                fontFamily={theme.fonts.space}
                fontWeight={700}
              >
                {formatDistanceToNow(votePeriodEnds, { addSuffix: true })}
              </Text>
            </Box>
          </Flex>
          <Box mt={6}>
            <Text
              textTransform='uppercase'
              fontSize='sm'
              fontFamily={theme.fonts.heading}
              fontWeight={700}
            >
              Link
            </Text>
            <Link href={details.link} target='_blank'>
              {details.link} <Icon name='external-link' />
            </Link>
          </Box>
        </Box>
        <Box pl={6}>
          <Icon name='votedYes' size='45px' />
        </Box>
      </Flex>
      <Box w='100%' mt={8}>
        {details.description}
      </Box>
      <Flex w='100%' mt={6} justify='space-between'>
        <Box mr={5}>
          <Text
            textTransform='uppercase'
            fontSize='sm'
            mb={4}
            fontFamily={theme.fonts.heading}
            fontWeight={700}
          >
            Submitted By
          </Text>
          <UserAvatar user={user} />
        </Box>
        <Box>
          <Text
            textTransform='uppercase'
            fontSize='sm'
            fontFamily={theme.fonts.heading}
            fontWeight={700}
            mb={6}
          >
            Recipient
          </Text>
          <Text fontFamily={theme.fonts.space} fontWeight={700}>
            {proposal.applicant}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default ProposalDetail;
