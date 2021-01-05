import React from "react";
import ActivitiesCard from "../components/activitiesCard";
import OverviewCard from "../components/overviewCard";
import { SplitLayout } from "../components/staticElements";
import { BodyMd, DisplayLg } from "../styles/typography";

const Overview = React.memo(function Overview({
  overview,
  activities,
  title,
  isMember,
  isCorrectNetwork,
}) {
  return (
    <SplitLayout>
      <div className="title-section">
        <DisplayLg>{title}</DisplayLg>
        {isCorrectNetwork || (
          <BodyMd>You are not connected to the correct network</BodyMd>
        )}
      </div>
      {overview && <OverviewCard overview={overview} isMember={isMember} />}
      {activities && <ActivitiesCard activities={activities} />}
    </SplitLayout>
  );
});

export default Overview;
