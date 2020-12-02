import React from 'react';
import { Link } from 'react-router-dom';

import { formatCreatedAt } from '../../utils/helpers';
import { Badge, Box, Heading, Stack, Skeleton } from '@chakra-ui/react';

import ContentBox from '../Shared/ContentBox';
const ActivityCard = ({ activity, isLoaded }) => {
  return (
    <ContentBox mt={2}>
      <Link to={`/dao/${activity.molochAddress}`}>
        {activity.proposalId && (
          <>
            <Skeleton isLoaded={isLoaded}>
              <Heading as='h4' size='md'>
                {activity.proposalType}: {activity.daoTitle}
              </Heading>
              {/* <Box>{getProposalCountdownText(activity)}</Box> */}

              <Stack isInline>
                <Badge colorScheme='green'>{activity.yesVotes} Yes</Badge>
                <Badge colorScheme='red'>{activity.noVotes} No</Badge>
              </Stack>
              <Badge>{activity.activityFeed.message}</Badge>
            </Skeleton>
          </>
        )}
        {!activity.proposalId && (
          <>
            <Skeleton isLoaded={isLoaded}>
              <Heading as='h4' size='md'>
                {activity?.createdAt
                  ? `Rage Quit on ${formatCreatedAt(activity.createdAt)}`
                  : '--'}
              </Heading>
              <Box>Shares: {activity?.shares ? activity.shares : '--'}</Box>
              <Box>Loot: {activity?.loot ? activity.loot : '--'}</Box>
              <Box>
                memberAddress:{' '}
                {activity?.memberAddress ? activity.memberAddress : '--'}
              </Box>
            </Skeleton>
          </>
        )}
      </Link>
    </ContentBox>
  );
};

export default ActivityCard;
