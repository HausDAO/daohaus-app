import React from "react";
import styled from "styled-components";
import { BodyMd, HeaderLg } from "../styles/typography";
import BankTotal from "./bankTotal";
import { formatDistanceToNow } from "date-fns";
import Button from "./button";
import { useToken } from "../contexts/TokenContext";

const StyledOverviewCard = styled.div``;

const OverviewCard = ({ overview, isMember }) => {
  const { tokenBalances, totalLoot, totalShares, title } = overview?.moloch;

  // const handleGetUSDs = () => {
  //   if (tokenBalances) {
  //     initPrices(tokenBalances);
  //   }
  // };
  return (
    <StyledOverviewCard>
      <HeaderLg>Overview</HeaderLg>
      {/* <Button content="Test API" className="primary" onClick={handleGetUSDs} /> */}
      <BodyMd>{isMember ? "You are a member" : "You are not a member"}</BodyMd>
      <BodyMd>Name: {title} </BodyMd>
      <BodyMd>Shares: {totalShares} </BodyMd>
      <BankTotal />
      <BodyMd>Loot: {totalLoot} </BodyMd>
      <BodyMd>{tokenBalances.length} Tokens </BodyMd>
    </StyledOverviewCard>
  );
};

export default OverviewCard;
