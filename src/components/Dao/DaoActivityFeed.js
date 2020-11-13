import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/core';

import GraphFetch from '../Shared/GraphFetch';
import TextBox from '../Shared/TextBox';
import { DAO_ACTIVITIES } from '../../utils/apollo/dao-queries';
import { activitiesData } from '../../content/skeleton-data';
import DaoActivityCard from '../Activities/DaoActivityCard';
import { getDaoActivites } from '../../utils/activities-helpers';
import ActivityPaginator from '../Activities/ActivityPaginator';
import { useDao } from '../../contexts/PokemolContext';

const DaoActivityFeed = () => {
  const [dao] = useDao();
  const [fetchedData, setFetchedData] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activities, setActivities] = useState(activitiesData);
  const [allActivities, setAllActivities] = useState();

  useEffect(() => {
    if (fetchedData) {
      const hydratedActivites = getDaoActivites(fetchedData);
      setAllActivities(hydratedActivites);
      setIsLoaded(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedData]);

  return (
    <Box>
      <TextBox size='sm'>Activity Feed</TextBox>

      {activities.map((activity) => (
        <DaoActivityCard
          activity={activity}
          key={activity.id}
          isLoaded={isLoaded}
        />
      ))}

      {isLoaded ? (
        <ActivityPaginator
          perPage={3}
          setRecords={setActivities}
          allRecords={allActivities}
        />
      ) : null}

      {dao ? (
        <GraphFetch
          query={DAO_ACTIVITIES}
          setRecords={setFetchedData}
          entity='moloch'
          variables={{ contractAddr: dao.address }}
          context={{ currentPeriod: dao.currentPeriod }}
        />
      ) : null}
    </Box>
  );
};

export default DaoActivityFeed;
