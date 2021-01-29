import React from 'react';
import ActivityCard from './activityCard';
import TextBox from './TextBox';

const ActivitiesFeed = ({ activities, hydrateFn, limit }) => {
  const allActivities = activities ? hydrateFn(activities) : [];

  console.log('allActivities', allActivities);

  return (
    <>
      <TextBox>Activities</TextBox>
      {allActivities &&
        allActivities
          .slice(0, limit)
          .map((activity, index) => (
            <ActivityCard
              key={index}
              activity={activity}
              displayAvatar={true}
            />
          ))}
    </>
  );
};

export default ActivitiesFeed;
