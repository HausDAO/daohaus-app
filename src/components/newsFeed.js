import React, { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';

import { useUser } from '../contexts/UserContext';
import ActivitiesFeed from './activitiesFeed';
import { getDaoActivites } from '../utils/activities';

const combineDaoDataForHub = (userHubDaos) => {
  return userHubDaos.reduce(
    (activities, network) => {
      network.data.forEach((dao) => {
        activities.proposals = [
          ...activities.proposals,
          ...dao.moloch.proposals.filter((prop) => prop.activityFeed.unread),
        ];
        activities.rageQuits = [
          ...activities.rageQuits,
          ...dao.moloch.rageQuits.filter((rage) => {
            // 1209600000 === 2 weeks
            const now = (new Date() / 1000) | 0;
            // return +rage.createdAt >= now - 1209600;
            return +rage.createdAt >= now - 2419200;
          }),
        ];
      });

      return activities;
    },
    { proposals: [], rageQuits: [] },
  );
};

// each dao - get unread props

const NewsFeed = () => {
  const { userHubDaos, hasLoadedHubData } = useUser();
  const [daoData, setDaoData] = useState(null);

  console.log('userHubDaos', userHubDaos);

  useEffect(() => {
    if (hasLoadedHubData) {
      const combo = combineDaoDataForHub(userHubDaos);

      console.log('combo', combo);
      setDaoData(combo);
    }
  }, [userHubDaos, hasLoadedHubData]);

  return (
    <>
      <Box
        fontSize='md'
        fontFamily='heading'
        texttransform='uppercase'
        fontWeight={700}
      >
        Recent Activity
      </Box>
      {daoData ? (
        <ActivitiesFeed
          activities={daoData}
          limit={7}
          hydrateFn={getDaoActivites}
        />
      ) : null}
    </>
  );
};

export default NewsFeed;
