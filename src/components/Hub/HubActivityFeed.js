import React, { useEffect, useState } from 'react';

import { activitiesData } from '../../content/skeleton-data';
import ActivityCard from '../Activities/ActivityCard';
import Paginator from '../Shared/Paginator';

const HubActivityFeed = ({ daos }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activityData, setActivityData] = useState(activitiesData);
  const [allActivities, setAllActivities] = useState();

  useEffect(() => {
    let proposalActivities = [];
    let unreadProposals = [];
    let rageActivities = [];

    daos.forEach((dao) => {
      const activeProps = dao.proposals.filter((prop) => {
        return prop.activityFeed.unread;
      });
      unreadProposals = [...unreadProposals, ...activeProps];

      proposalActivities = [
        ...proposalActivities,
        ...activeProps.map((proposal) => {
          return { ...proposal, daoTitle: dao.title };
        }),
      ];

      const activeRages = dao.rageQuits.filter((rage) => {
        // 1209600000 === 2 weeks
        const now = (new Date() / 1000) | 0;
        return +rage.createdAt >= now - 1209600;
      });

      rageActivities = [
        ...rageActivities,
        ...activeRages.map((rage) => {
          return { ...rage, daoTitle: dao.title };
        }),
      ];
    });

    setAllActivities(
      [...proposalActivities, ...rageActivities].sort(
        (a, b) => +b.createdAt - +a.createdAt,
      ),
    );
    setIsLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daos]);

  return (
    <>
      {activityData.map((activity) => (
        <ActivityCard activity={activity} key={activity.id} isLoaded={true} />
      ))}

      {isLoaded ? (
        <Paginator
          perPage={7}
          setRecords={setActivityData}
          allRecords={allActivities}
        />
      ) : null}
    </>
  );
};

export default HubActivityFeed;
