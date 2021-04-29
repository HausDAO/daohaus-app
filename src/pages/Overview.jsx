import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { useParams } from 'react-router';

import ActivitiesFeed from '../components/activitiesFeed';
import MemberInfoCard from '../components/memberInfo';
import OverviewCard from '../components/overviewCard';
import { getDaoActivites } from '../utils/activities';
import MainViewLayout from '../components/mainViewLayout';
import StakingBanner from '../components/stakingBanner';
import CcoBanner from '../components/ccoBanner';
import { UBERHAUS_DATA } from '../utils/uberhaus';
// import { getActiveMembers } from '../utils/dao';

const Overview = React.memo(function overview({
  daoOverview,
  activities,
  isMember,
  members,
  daoMember,
  currentDaoTokens,
  customTerms,
  daoMetaData,
}) {
  const { daoid } = useParams();
  const isUberHaus = daoid === UBERHAUS_DATA.ADDRESS;

  return (
    <MainViewLayout header='Overview' customTerms={customTerms} isDao>
      <Box w='100%'>
        <Flex wrap='wrap'>
          {overview && (
            <Box
              w={['100%', null, null, null, '50%']}
              pr={[0, null, null, null, 6]}
              mb={6}
            >
              <OverviewCard
                daoOverview={daoOverview}
                isMember={isMember}
                members={members}
                currentDaoTokens={currentDaoTokens}
              />
              {isUberHaus ? <StakingBanner /> : null}
              {daoMetaData?.boosts?.cco?.active ? <CcoBanner /> : null}
            </Box>
          )}
          {isMember && (
            <Box w={['100%', null, null, null, '50%']}>
              <MemberInfoCard member={daoMember} hideCopy />
              <Box mt={6}>
                <ActivitiesFeed
                  activities={activities}
                  limit={3}
                  hydrateFn={getDaoActivites}
                  heading='Recent Activity'
                />
              </Box>
            </Box>
          )}
        </Flex>
      </Box>
    </MainViewLayout>
  );
});

export default Overview;
