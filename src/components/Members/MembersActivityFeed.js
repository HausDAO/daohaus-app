import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';

import TextBox from '../Shared/TextBox';
import { useActivities } from '../../contexts/PokemolContext';
import { activitiesData } from '../../content/skeleton-data';
import DaoActivityCard from '../Activities/DaoActivityCard';
import {
  getMemberActivites,
  getMembersActivites,
} from '../../utils/activities-helpers';
import Paginator from '../Shared/Paginator';

const MembersActivityFeed = ({ selectedMember }) => {
  const [activities] = useActivities();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activityData, setActivityData] = useState(activitiesData);
  const [allActivities, setAllActivities] = useState();

  useEffect(() => {
    if (activities.proposals) {
      const hydratedActivites = getMembersActivites(activities);
      setAllActivities(hydratedActivites);
      setIsLoaded(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activities]);

  useEffect(() => {
    if (selectedMember && activities.proposals) {
      const hydratedActivites = getMemberActivites(
        activities,
        selectedMember.memberAddress,
      );
      setAllActivities(hydratedActivites);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMember, activities]);

  return (
    <Box mt={6}>
      <TextBox size='xs'>Activity Feed</TextBox>

      {activityData.map((activity) => (
        <DaoActivityCard
          activity={activity}
          key={activity.id}
          isLoaded={isLoaded}
        />
      ))}

      {isLoaded ? (
        <Paginator
          perPage={2}
          setRecords={setActivityData}
          allRecords={allActivities}
        />
      ) : null}
    </Box>
  );
};

export default MembersActivityFeed;
