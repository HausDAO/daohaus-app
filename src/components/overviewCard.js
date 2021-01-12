import React from "react";
import { useParams, Link } from "react-router-dom";
import { useCustomTheme } from "../contexts/CustomThemeContext";
import { useMetaData } from "../contexts/MetaDataContext";
import BankTotal from "./bankTotal";

const OverviewCard = ({ overview, isMember, membersAmt }) => {
  const { daochain, daoid } = useParams;
  const { daoMetadata } = useMetaData();
  const { customCopy } = useCustomTheme();
  const { tokenBalances, totalLoot, totalShares, title } = overview?.moloch;

  return (
    <div>
      <div>
        <h4>Details</h4>
        <p>{isMember ? "You are a member" : "You are not a member"}</p>
        <h2>{title} </h2>
        {daoMetadata && <p>{daoMetadata?.description}</p>}
        <p>
          {customCopy ? customCopy?.members : "Members"}: {membersAmt}
        </p>
        <BankTotal customBank={customCopy?.bank} />
        <p>Shares: {totalShares} </p>
        <p>Loot: {totalLoot} </p>
        <p>{tokenBalances.length} Tokens </p>
        <Link className="nav-link" to={`/dao/${daochain}/${daoid}/proposals`}>
          <p>{customCopy ? customCopy.proposals : "Proposals"}</p>
        </Link>
        <Link className="nav-link" to={`/dao/${daochain}/${daoid}/bank`}>
          <p>{customCopy ? customCopy.bank : "Proposals"}</p>
        </Link>
      </div>
    </div>
  );
};

export default OverviewCard;
