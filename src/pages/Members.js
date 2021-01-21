import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import ActivitiesFeed from "../components/activitiesFeed";
import Chart from "../components/chart";
import MemberCard from "../components/memberCard";
import MemberInfo from "../components/memberInfo";
import { useDaoMember } from "../contexts/DaoMemberContext";
import { getMemberActivites, getMembersActivites } from "../utils/activities";

const Members = ({ members, activities }) => {
  const { daoMember } = useDaoMember();
  const { daoid, daochain } = useParams();
  const [selectedMember, setSelectedMember] = useState(null);

  const selectMember = (member) => {
    if (selectedMember == null) {
      setSelectedMember(member);
    } else {
      if (selectedMember.memberAddress === member.memberAddress) {
        setSelectedMember(null);
      } else {
        setSelectedMember(member);
      }
    }
  };
  return (
    <div>
      {selectedMember ? (
        <ActivitiesFeed
          limit={2}
          activities={activities}
          hydrateFn={getMemberActivites(selectedMember.memberAddress)}
        />
      ) : (
        <ActivitiesFeed
          limit={2}
          activities={activities}
          hydrateFn={getMembersActivites}
        />
      )}
      {selectedMember ? (
        <MemberInfo member={selectedMember} />
      ) : (
        <>
          {daoMember && (
            <Link
              to={`/dao/${daochain}/${daoid}/profile/${daoMember.memberAddress}`}
            >
              View My Profile
            </Link>
          )}
          <Chart />
        </>
      )}
      <h3>Members</h3>
      {members &&
        members?.slice(0, 10).map((member) => {
          return (
            <MemberCard
              key={member.id}
              member={member}
              selectMember={selectMember}
            />
          );
        })}
    </div>
  );
};

export default Members;
