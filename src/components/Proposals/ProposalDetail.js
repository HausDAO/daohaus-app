import React from 'react';
import { formatDistanceToNow, isBefore } from 'date-fns';
import { Flex, Box, Text, Icon, Link } from '@chakra-ui/core';
import { utils } from 'web3';

import { useUser } from '../../contexts/PokemolContext';
import UserAvatar from '../../components/Shared/UserAvatar';

const ProposalDetail = ({ proposal }) => {
  const [user] = useUser();
  console.log(proposal);
  const details = proposal.details && JSON.parse(proposal.details);
  console.log(details);
  const votePeriodEnds = new Date(+proposal.votingPeriodEnds * 1000);
  return (
    <Box
      rounded='lg'
      bg='blackAlpha.600'
      borderWidth='1px'
      borderColor='whiteAlpha.200'
      p={6}
      mt={2}
    >
      <Flex>
        <Box w='90%'>
          <Text textTransform='uppercase' fontSize='0.9em'>
            {proposal.proposalType}
          </Text>
          <Text fontSize='3xl'>{details?.title}</Text>
          <Flex w='100%' justify='space-between' mt={6}>
            <Box>
              <Text textTransform='uppercase' fontSize='0.9em'>
                Tribute
              </Text>
              <Text>
                {utils.fromWei(proposal.tributeOffered.toString())}{' '}
                {proposal.tributeTokenSymbol || 'WETH'}
              </Text>
            </Box>
            <Box>
              <Text textTransform='uppercase' fontSize='0.9em'>
                Shares
              </Text>
              <Text>{proposal.sharesRequested}</Text>
            </Box>
            <Box>
              <Text textTransform='uppercase' fontSize='0.9em'>
                Loot
              </Text>
              <Text>{proposal.lootRequested}</Text>
            </Box>
            <Box>
              <Text textTransform='uppercase' fontSize='0.9em'>
                {isBefore(Date.now(), votePeriodEnds)
                  ? 'Voting Period'
                  : 'Voting Ended'}
              </Text>
              <Text>
                {formatDistanceToNow(votePeriodEnds, { addSuffix: true })}
              </Text>
            </Box>
          </Flex>
          <Box mt={6}>
            <Text textTransform='uppercase' fontSize='0.9em'>
              Link
            </Text>
            <Link href={details.link} target='_blank'>
              {details.link} <Icon name='external-link' />
            </Link>
          </Box>
        </Box>
        <Box pl={6}>
          <Icon name='thumbsUp' size='45px' />
        </Box>
      </Flex>
      <Box w='100%' mt={8}>
        {details.description}
      </Box>
      <Flex w='100%' mt={6}>
        <Box mr={5}>
          <Text textTransform='uppercase' fontSize='0.9em' mb={4}>
            Submitted By
          </Text>
          <UserAvatar user={user} />
        </Box>
        <Box>
          <Text textTransform='uppercase' fontSize='0.9em'>
            Recipient
          </Text>
          <Text>{proposal.applicant}</Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default ProposalDetail;
