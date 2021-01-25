import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { timeToNow } from "../utils/general";

const MemberInfoCard = ({ member }) => {
  const { daoid, daochain } = useParams();
  const name = member.hasProfile ? member.name : member.memberAddress;
  return (
    <>
      {member && (
        <div>
          <h3>Member Info: </h3>
          <Link
            to={`/dao/${daochain}/${daoid}/profile/${member.memberAddress}`}
          >
            View Profile
          </Link>
          <p>Name: {name} </p>
          <p>Shares: {member.shares}</p>
          <p>Loot: {member.loot}</p>
          <p>Anniversary: {timeToNow(member.createdAt)}</p>
        </div>
      )}
    </>
  );
};

export default MemberInfoCard;
