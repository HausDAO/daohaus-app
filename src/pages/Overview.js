import React from "react";
import ActivitiesCard from "../components/activitiesFeed";
import OverviewCard from "../components/overviewCard";

const Overview = React.memo(function Overview({
  overview,
  activities,
  title,
  isMember,
  isCorrectNetwork,
  members,
}) {
  return (
    <div>
      <div className="title-section">
        <h1>{title}</h1>
        {isCorrectNetwork || (
          <p>You are not connected to the correct network</p>
        )}
      </div>
      {overview && (
        <OverviewCard
          overview={overview}
          isMember={isMember}
          membersAmt={members?.daoMembers?.length}
        />
      )}
      {activities && <ActivitiesCard activities={activities?.moloch} />}
    </div>
  );
});

export default Overview;
