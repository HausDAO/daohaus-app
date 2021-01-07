import React from "react";
import { BodyMd, HeaderSm } from "../styles/typography";

const Members = ({ members }) => {
  return (
    <div>
      {members.map((member) => {
        return (
          <div key={member.id}>
            <HeaderSm>{member.memberAddress}</HeaderSm>
            <BodyMd>Shares: {member.shares}</BodyMd>
            <BodyMd>Loot: {member.loot}</BodyMd>
          </div>
        );
      })}
    </div>
  );
};

export default Members;
