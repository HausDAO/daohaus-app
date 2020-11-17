import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/core';

import { activitiesData } from '../../content/skeleton-data';
import { getProposalHistories } from '../../utils/activities-helpers';
import ActivityPaginator from '../Activities/ActivityPaginator';
import ProposalHistoryCard from './ProposalHistoryCard';

const ProposalHistory = ({ proposal }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activities, setActivities] = useState(activitiesData);
  const [allActivities, setAllActivities] = useState();

  useEffect(() => {
    if (proposal) {
      const hydratedActivites = getProposalHistories(proposal);
      setAllActivities(hydratedActivites);
      setIsLoaded(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposal]);

  return (
    <>
      <Box mt={6} textTransform='uppercase' fontSize='sm' fontFamily='heading'>
        Proposal History
      </Box>

      {activities.map((activity, i) => (
        <ProposalHistoryCard activity={activity} key={i} isLoaded={isLoaded} />
      ))}

      {isLoaded ? (
        <ActivityPaginator
          perPage={5}
          setRecords={setActivities}
          allRecords={allActivities}
        />
      ) : null}
    </>
  );
};

export default ProposalHistory;
