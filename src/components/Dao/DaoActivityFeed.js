import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/core';
import Pagination from 'rc-pagination';

import GraphFetch from '../Shared/GraphFetch';
import { DAO_ACTIVITIES } from '../../utils/apollo/dao-queries';
import { activitiesData } from '../../content/skeleton-data';
import DaoActivityCard from '../Activities/DaoActivityCard';
import { getDaoActivites } from '../../utils/activities-helpers';

const PER_PAGE = 3;

const DaoActivityFeed = ({ dao }) => {
  const [fetchedData, setFetchedData] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activities, setActivities] = useState(activitiesData);
  const [allActivities, setAllActivities] = useState(activitiesData);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (fetchedData) {
      console.log('fetchedData', fetchedData);
      const hydratedActivites = getDaoActivites(fetchedData);
      console.log('hydratedActivites', hydratedActivites);

      setAllActivities(hydratedActivites);
      setActivities(filterVisibleActivites(hydratedActivites, currentPage));

      setIsLoaded(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedData]);

  const handlePageChange = (page) => {
    console.log('handlePageClick', page);
    setCurrentPage(page);
    setActivities(filterVisibleActivites(allActivities, page));
  };

  const filterVisibleActivites = (acts, page) => {
    const start = (page - 1) * PER_PAGE;
    const end = start + PER_PAGE;

    console.log('start, end ', start, end);
    return acts.slice(start, end);
  };

  return (
    <>
      <Box
        mt={6}
        ml={6}
        textTransform='uppercase'
        fontSize='sm'
        fontFamily='heading'
      >
        Activity Feed
      </Box>

      {activities.map((activity) => (
        <DaoActivityCard
          activity={activity}
          key={activity.id}
          isLoaded={isLoaded}
        />
      ))}

      {isLoaded ? (
        <Pagination
          onChange={handlePageChange}
          current={currentPage}
          total={allActivities.length}
          pageSize={PER_PAGE}
          hideOnSinglePage={true}
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
    </>
  );
};

export default DaoActivityFeed;
