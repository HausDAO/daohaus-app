import React, { useEffect, useState } from "react";
import ActivityCard from "./activityCard";
import { getDaoActivites } from "../utils/activities";

const ActivitiesFeed = ({ activities }) => {
  const [allActivities, setAllActivities] = useState(null);

  useEffect(() => {
    if (activities.proposals) {
      const hydratedActivites = getDaoActivites(activities);
      setAllActivities(hydratedActivites);
    }
  }, [activities]);

  return (
    <div>
      <h3>Activites</h3>
      {allActivities &&
        allActivities
          .slice(0, 3)
          .map((activity, index) => (
            <ActivityCard key={index} activity={activity} />
          ))}
    </div>
  );
};

export default ActivitiesFeed;
