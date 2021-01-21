import React from "react";
import ActivitiesFeed from "../components/activitiesFeed";
import OverviewCard from "../components/overviewCard";
import { getDaoActivites } from "../utils/activities";

const Overview = React.memo(function Overview({
  overview,
  activities,
  title,
  isMember,
  members,
}) {
  return (
    <div>
      <div className="title-section">
        <h1>{title}</h1>
      </div>
      {overview && (
        <OverviewCard
          overview={overview}
          isMember={isMember}
          membersAmt={members?.daoMembers?.length}
        />
      )}
      {activities && (
        <ActivitiesFeed
          activities={activities}
          limit={3}
          hydrateFn={getDaoActivites}
        />
      )}
    </div>
  );
});

export default Overview;
