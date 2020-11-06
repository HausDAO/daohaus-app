import React from 'react';
import { Link } from 'react-router-dom';

import { formatCreatedAt } from '../../utils/helpers';
import { Badge, Box, Heading, Stack, Text, Skeleton } from '@chakra-ui/core';
// import { getProposalCountdownText } from '../../utils/proposal-helper';

// TODO: get getProposalCountdownText(activity) outside of dao context?

const ActivityCard = ({ activity }) => {
  return (
    <Box
      rounded='lg'
      bg='blackAlpha.600'
      borderWidth='1px'
      borderColor='whiteAlpha.200'
      p={6}
      m={6}
      mt={2}
    >
      <Link to={`/dao/${activity.molochAddress}`}>
        {activity.proposalId && (
          <>
            <Heading as='h4' size='md'>
              {activity.proposalType}: {activity.daoTitle}
            </Heading>
            {/* <Text>{getProposalCountdownText(activity)}</Text> */}
            <Stack isInline>
              <Badge colorScheme='green'>{activity.yesVotes} Yes</Badge>
              <Badge colorScheme='red'>{activity.noVotes} No</Badge>
            </Stack>
            <Badge>{activity.activityFeed.message}</Badge>
          </>
        )}
        {!activity.proposalId && (
          <>
            <Skeleton>
              <Heading as='h4' size='md'>
                {activity?.createdAt
                  ? `Rage Quit on ${formatCreatedAt(activity.createdAt)}`
                  : '--'}
              </Heading>
            </Skeleton>
            <Skeleton>
              <Text>Shares: {activity?.shares ? activity.shares : '--'}</Text>
              <Text>Loot: {activity?.loot ? activity.loot : '--'}</Text>
              <Text>
                memberAddress:{' '}
                {activity?.memberAddress ? activity.memberAddress : '--'}
              </Text>
            </Skeleton>
          </>
        )}
      </Link>
    </Box>
  );
};

export default ActivityCard;
