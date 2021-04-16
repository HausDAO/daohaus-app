import React, { useState, useEffect } from 'react';

import { useUser } from '../contexts/UserContext';
import ActivitiesFeed from './activitiesFeed';
import { getDaoActivites } from '../utils/activities';
import { combineDaoDataForHub } from '../utils/dao';

const NewsFeed = () => {
  const { userHubDaos, hasLoadedHubData } = useUser();
  const [daoData, setDaoData] = useState(null);

  useEffect(() => {
    if (hasLoadedHubData) {
      setDaoData(combineDaoDataForHub(userHubDaos));
    }
  }, [userHubDaos, hasLoadedHubData]);

  return (
    <>
      {daoData && (daoData.proposals.length || daoData.rageQuits.length) && (
        <ActivitiesFeed
          activities={daoData}
          limit={7}
          hydrateFn={getDaoActivites}
        />
      )}
    </>
  );
};

export default NewsFeed;
