import React from "react";
import ActivitiesFeed from "../components/activitiesFeed";
import MemberInfoCard from "../components/memberInfo";
import OverviewCard from "../components/overviewCard";
import { getDaoActivites } from "../utils/activities";

const Overview = React.memo(function Overview({
  overview,
  activities,
  title,
  isMember,
  members,
  daoMember,
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
        // <DaoOverviewDetails members={members} overview={overview} />
      )}
      {isMember && (
        <>
          <ActivitiesFeed
            activities={activities}
            limit={3}
            hydrateFn={getDaoActivites}
          />
          <MemberInfoCard member={daoMember} />
        </>
      )}
    </div>
  );
});

export default Overview;
