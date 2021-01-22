import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';

import TextBox from '../Shared/TextBox';
import { activitiesData } from '../../content/skeleton-data';
import DaoActivityCard from '../Activities/DaoActivityCard';
import { getDaoActivites } from '../../utils/activities-helpers';
import { useActivities } from '../../contexts/PokemolContext';
import Paginator from '../Shared/Paginator';

const DaoActivityFeed = () => {
  const [activities] = useActivities();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activityData, setActivityData] = useState(activitiesData);
  const [allActivities, setAllActivities] = useState();

  useEffect(() => {
    if (activities.proposals) {
      const hydratedActivites = getDaoActivites(activities);
      setAllActivities(hydratedActivites);
      setIsLoaded(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activities]);

  return (
    <Box>
      <TextBox size='sm'>Activity Feed</TextBox>

      {activityData.map((activity) => (
        <DaoActivityCard
          activity={activity}
          key={activity.id}
          isLoaded={isLoaded}
        />
      ))}

      {isLoaded ? (
        <Paginator
          perPage={3}
          setRecords={setActivityData}
          allRecords={allActivities}
        />
      ) : null}
    </Box>
  );
};

export default DaoActivityFeed;
