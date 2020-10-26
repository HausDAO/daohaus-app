import React from 'react';

import ActivityCard from './ActivityCard';

const ActivityFeedList = ({ activities }) => {
  return (
    <div>
      {activities.map((activity) => (
        <ActivityCard activity={activity} key={activity.id} />
      ))}
    </div>
  );
};

export default ActivityFeedList;
