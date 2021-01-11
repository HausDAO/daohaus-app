import React from "react";
import { BodyMd, HeaderSm } from "../styles/typography";

const Members = ({ members }) => {
  return (
    <div>
      {members.map((member) => {
        return (
          <div key={member.id}>
            <HeaderSm>{member.memberAddress}</HeaderSm>
            <p>Shares: {member.shares}</p>
            <p>Loot: {member.loot}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Members;
