import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProfile } from '3box';
import { Badge, Box, Heading, Stack, Skeleton } from '@chakra-ui/react';

import { formatCreatedAt } from '../../utils/helpers';
import TextBox from '../Shared/TextBox';
import ContentBox from '../Shared/ContentBox';
import MemberAvatar from '../Members/MemberAvatar';

const ActivityCard = ({ activity, isLoaded }) => {
  const [profile, setProfile] = useState();

  useEffect(() => {
    let isCancelled = false;
    const fetchProfile = async () => {
      let profileRes;
      try {
        profileRes = await getProfile(activity.memberAddress);
      } catch (err) {}

      if (!isCancelled) {
        setProfile({
          memberAddress: activity.memberAddress,
          profile: profileRes,
        });
      }
    };

    if (activity.memberAddress) {
      fetchProfile();
    }

    return () => {
      isCancelled = true;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity]);

  return (
    <ContentBox mt={3}>
      <Link to={`/dao/${activity.molochAddress}`}>
        {activity.proposalId && (
          <>
            <Skeleton isLoaded={isLoaded}>
              <TextBox size='xs' mb={2}>
                {activity.daoTitle}
              </TextBox>
              <Heading as='h4' size='sm' fontWeight='100'>
                {activity.proposalType}
              </Heading>
              {/* <Box>{getProposalCountdownText(activity)}</Box> */}

              <Stack isInline mt={3}>
                <Badge variant='solid'>{activity.activityFeed.message}</Badge>
                <Badge colorScheme='green'>{activity.yesVotes} Yes</Badge>
                <Badge colorScheme='red'>{activity.noVotes} No</Badge>
              </Stack>
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
                <MemberAvatar member={profile} />
              </Box>
            </Skeleton>
          </>
        )}
      </Link>
    </ContentBox>
  );
};

export default ActivityCard;
