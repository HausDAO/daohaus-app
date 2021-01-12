import React, { useEffect, useState } from "react";

import { fetchProfile } from "../utils/3box";
import { truncateAddr } from "../utils/general";

const ActivityCard = ({ activity, title, badge }) => {
  const [profile, setProfile] = useState();

  useEffect(() => {
    let isCancelled = false;
    const getProfile = async () => {
      try {
        const newProfile = await fetchProfile(
          activity.activityData.memberAddress
        );
        if (!isCancelled) {
          setProfile(newProfile);
        }
      } catch (error) {
        console.log("MemberDoesn't have a profile");
      }
    };
    if (activity.activityData) {
      getProfile();
    }
    return () => {
      isCancelled = true;
    };
  }, [activity]);

  const renderTitle = () => {
    if (activity && activity.activityData) {
      return `${
        profile?.name || truncateAddr(activity.activityData.memberAddress)
      } ${activity.activityData.title}`;
    } else {
      return "--";
    }
  };

  return (
    <div>
      <p>{renderTitle()}</p>
    </div>
  );
};

export default ActivityCard;
