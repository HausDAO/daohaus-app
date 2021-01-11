import React from "react";
import ActivitiesCard from "../components/activitiesCard";
import OverviewCard from "../components/overviewCard";

const Overview = React.memo(function Overview({
  overview,
  activities,
  title,
  isMember,
  isCorrectNetwork,
}) {
  return (
    <div>
      <div className="title-section">
        <h1>{title}</h1>
        {isCorrectNetwork || (
          <p>You are not connected to the correct network</p>
        )}
      </div>
      {overview && <OverviewCard overview={overview} isMember={isMember} />}
      {activities && <ActivitiesCard activities={activities} />}
    </div>
  );
});

export default Overview;
