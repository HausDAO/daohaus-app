import React, { useState, useEffect } from "react";
import makeBlockie from "ethereum-blockies-base64";
import { Avatar } from "@chakra-ui/react";

import { handleGetProfile } from "../utils/3box";

const MemberCard = ({ member, selectMember }) => {
  const [memberData, setMemberData] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const profile = await handleGetProfile(member.memberAddress);
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

  const handleSelect = () => {
    if (memberData) {
      selectMember({ ...member, ...memberData, hasProfile: true });
    } else {
      selectMember(member);
    }
  };

  return (
    <>
      {memberData ? (
        <div key={memberData.proofDid}>
          <Avatar
            name={memberData.name}
            src={`https://ipfs.infura.io/ipfs/${memberData.image[0].contentUrl["/"]}`}
            size="md"
          />
          <button onClick={handleSelect}>Select Member</button>
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
          <button onClick={handleSelect}>Select Member</button>
          <p>{member.memberAddress}</p>
          <p>Shares: {member.shares}</p>
          <p>Loot: {member.loot}</p>
        </div>
      )}
    </>
  );
};

export default MemberCard;
