import React from 'react';
import { Link } from 'react-router-dom';

import { formatCreatedAt } from '../../utils/Helpers';
import { Badge, Box, Heading, Stack, Text } from '@chakra-ui/core';
// import { getProposalCountdownText } from '../../utils/ProposalHelper';

// TODO: get getProposalCountdownText(activity) outside of dao context?

const ActivityCard = ({ activity }) => {
  return (
    <Box>
      <Link to={`/dao/${activity.molochAddress}`}>
        {activity.proposalId ? (
          <>
            <Heading as="h4" size="md">
              {activity.proposalType}: {activity.daoTitle}
            </Heading>
            {/* <Text>{getProposalCountdownText(activity)}</Text> */}
            <Stack isInline>
              <Badge variantColor="green">{activity.yesVotes} Yes</Badge>
              <Badge variantColor="red">{activity.noVotes} No</Badge>
            </Stack>
            <Badge>{activity.activityFeed.message}</Badge>
          </>
        ) : (
          <>
            <Heading as="h4" size="md">
              Rage Quit on {formatCreatedAt(activity.createdAt)}
            </Heading>
            <Text>Shares: {activity.shares}</Text>
            <Text>Loot: {activity.loot}</Text>
            <Text>memberAddress: {activity.memberAddress}</Text>
          </>
        )}
      </Link>
    </Box>
  );
};

export default ActivityCard;
