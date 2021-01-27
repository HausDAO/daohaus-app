import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import ActivitiesFeed from '../components/activitiesFeed';
import MemberInfoCard from '../components/memberInfo';
import OverviewCard from '../components/overviewCard';
import { getDaoActivites } from '../utils/activities';

const Overview = React.memo(function Overview({
  overview,
  activities,
  isMember,
  members,
  daoMember,
}) {
  return (
    <Box w='100%'>
      <Flex wrap='wrap'>
        {overview && (
          <Box
            w={['100%', null, null, null, '50%']}
            pr={[0, null, null, null, 6]}
            mb={6}
          >
            <OverviewCard
              overview={overview}
              isMember={isMember}
              membersAmt={members?.length}
            />
          </Box>
        )}
        {isMember && (
          <Box w={['100%', null, null, null, '50%']}>
            <MemberInfoCard member={daoMember} />
            <Box mt={6}>
              <ActivitiesFeed
                activities={activities}
                limit={3}
                hydrateFn={getDaoActivites}
              />
            </Box>
          </Box>
        )}
      </Flex>
    </Box>
  );
});

export default Overview;
