import React, { useState, useEffect } from "react";
import makeBlockie from "ethereum-blockies-base64";
import { Avatar } from "@chakra-ui/react";

import { fetchProfile } from "../utils/3box";

const MemberCard = ({ member }) => {
  const [memberData, setMemberData] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const profile = await fetchProfile(member.memberAddress);
        if (profile.status === "error") {
          return;
        }
        setMemberData(profile);
      } catch (error) {
        console.log("MemberDoesn't have a profile");
      }
    };

    getProfile();
  }, [member]);

  useEffect(() => {
    if (memberData) {
      //get member pic
    }
  }, [memberData]);

  return (
    <>
      {memberData ? (
        <div key={memberData.proofDid}>
          <Avatar
            name={memberData.name}
            src={`https://ipfs.infura.io/ipfs/${memberData.image[0].contentUrl["/"]}`}
            size="md"
          />
          <p>{memberData.name}</p>
          <p>Shares: {member.shares}</p>
          <p>Loot: {member.loot}</p>
        </div>
      ) : (
        <div key={member.id}>
          <Avatar
            name={member.memberAddress}
            src={makeBlockie(member.memberAddress)}
            size="md"
          />

          <p>{member.memberAddress}</p>
          <p>Shares: {member.shares}</p>
          <p>Loot: {member.loot}</p>
        </div>
      )}
    </>
  );
};

export default MemberCard;
