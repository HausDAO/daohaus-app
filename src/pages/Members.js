import React from "react";
import MemberCard from "../components/memberCard";

const Members = ({ members }) => {
  return (
    <div>
      {members &&
        members?.slice(0, 10).map((member) => {
          return <MemberCard key={member.id} member={member} />;
        })}
    </div>
  );
};

export default Members;
