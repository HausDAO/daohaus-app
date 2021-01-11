import React from "react";
import BankTotal from "./bankTotal";

const OverviewCard = ({ overview, isMember }) => {
  const { tokenBalances, totalLoot, totalShares, title } = overview?.moloch;

  return (
    <div>
      <h1>Overview</h1>
      <p>{isMember ? "You are a member" : "You are not a member"}</p>
      <p>Name: {title} </p>
      <p>Shares: {totalShares} </p>
      <BankTotal />
      <p>Loot: {totalLoot} </p>
      <p>{tokenBalances.length} Tokens </p>
    </div>
  );
};

export default OverviewCard;
