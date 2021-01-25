import React, { useEffect, useState } from "react";
import { Avatar } from "@chakra-ui/react";

import { handleGetProfile } from "../utils/3box";
import { timeToNow } from "../utils/general";
import makeBlockie from "ethereum-blockies-base64";

const handleName = (activity, profile) => {
  return profile ? profile?.name : activity?.memberAddress;
};

const handleAvatar = (activity, profile) => {
  if (profile?.image?.length) {
    const url = profile?.image[0].contentUrl;
    return (
      <Avatar
        //adds key to prevent react from skipping this render
        key={`profile${activity.memberAddress}`}
        name={profile?.name}
        size="sm"
        src={`https://ipfs.infura.io/ipfs/${url["/"]}`}
      />
    );
  } else {
    return (
      <Avatar
        key={`no-profile${activity.memberAddress}`}
        name={activity?.memberAddress}
        size="sm"
        src={makeBlockie(activity?.memberAddress)}
      />
    );
  }
};

const ActivityCard = ({ activity, displayAvatar }) => {
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    let isCancelled = false;
    const getProfile = async () => {
      try {
        const newProfile = await handleGetProfile(activity.memberAddress);
        if (newProfile.status === "error") return;
        if (!isCancelled) {
          setProfile(newProfile);
        }
      } catch (error) {
        console.log("MemberDoesn't have a profile");
      }
    };
    if (activity.memberAddress) {
      getProfile();
    }
    return () => {
      isCancelled = true;
    };
  }, [activity]);

  //ACTIVITY MODEL

  // activity: {
  //   title: String
  //   createdAt: INT date(UTC),
  //   voteBadge: Int,
  //   statusBadge: String,
  //   rageBadge: String
  //   status: String
  // }
  const name = handleName(activity, profile);
  return (
    <div>
      {displayAvatar && handleAvatar(activity, profile)}
      {activity?.title && (
        <p>
          {name} {activity.title}
        </p>
      )}
      {activity?.createdAt && <p> {timeToNow(activity.createdAt)}</p>}
      {activity?.voteBadge && <p>{activity.voteBadge ? "Yes" : "No"}</p>}
      {activity?.statusBadge && <p>{activity.statusBadge}</p>}
      {activity?.negativeStatus && <p>{activity.negativeStatus}</p>}
      {activity?.positiveStatus && <p>{activity.positiveStatus}</p>}
      {activity?.voteStatus && <p>{activity.voteStatus}</p>}
      {activity?.dateCreated && <p>{activity.rageBadge}</p>}
    </div>
  );
};

export default ActivityCard;
