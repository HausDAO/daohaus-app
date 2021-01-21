import React, { useEffect, useState } from "react";
import ActivityCard from "./activityCard";

const ActivitiesFeed = ({ activities, hydrateFn, limit }) => {
  const allActivities = activities ? hydrateFn(activities) : [];

  return (
    <div>
      <h3>Activites</h3>
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
    </div>
  );
};

export default ActivitiesFeed;
