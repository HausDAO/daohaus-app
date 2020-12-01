import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';

import { useActivities } from '../../contexts/PokemolContext';
import { activitiesData } from '../../content/skeleton-data';
import DaoActivityCard from '../Activities/DaoActivityCard';
import { getProfileActivites } from '../../utils/activities-helpers';
import Paginator from '../Shared/Paginator';

const ProfileActvityFeed = ({ profileAddress }) => {
  const [activities] = useActivities();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activityData, setActivityData] = useState(activitiesData);
  const [allActivities, setAllActivities] = useState();

  useEffect(() => {
    if (activities.proposals) {
      const hydratedActivites = getProfileActivites(
        activities,
        profileAddress.toLowerCase(),
      );
      setAllActivities(hydratedActivites);
      setIsLoaded(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activities]);

  return (
    <>
      <Box mt={6} textTransform='uppercase' fontSize='sm' fontFamily='heading'>
        Recent Activity
      </Box>

      {activityData.map((activity) => (
        <DaoActivityCard
          activity={activity}
          key={activity.id}
          isLoaded={isLoaded}
        />
      ))}

      {isLoaded ? (
        <Paginator
          perPage={5}
          setRecords={setActivityData}
          allRecords={allActivities}
        />
      ) : null}
    </>
  );
};

export default ProfileActvityFeed;
