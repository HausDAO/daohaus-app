import React, { useEffect, useState } from 'react';
import ActivityFeedList from '../ActivityFeed/ActivityFeedList';

const HubActivityFeed = ({ daos }) => {
  const [activities, setActivities] = useState([]);
  console.log(activities);

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

    setActivities(
      [...proposalActivities, ...rageActivities].sort(
        (a, b) => +b.createdAt - +a.createdAt,
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <ActivityFeedList activities={activities} />;
};

export default HubActivityFeed;
