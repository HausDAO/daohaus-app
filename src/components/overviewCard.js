import React from "react";
import styled from "styled-components";
import { BodyMd, HeaderLg } from "../styles/typography";
import { formatDistanceToNow } from "date-fns";

const StyledOverviewCard = styled.div``;

const OverviewCard = ({ overview, isMember }) => {
  const { tokenBalances, totalLoot, totalShares, title } = overview?.moloch;
  return (
    <StyledOverviewCard>
      <HeaderLg>Overview</HeaderLg>
      <BodyMd>{isMember ? "You are a member" : "You are not a member"}</BodyMd>
      <BodyMd>Name: {title} </BodyMd>
      <BodyMd>Shares: {totalShares} </BodyMd>
      <BodyMd>Loot: {totalLoot} </BodyMd>
      <BodyMd>{tokenBalances.length} Tokens </BodyMd>
    </StyledOverviewCard>
  );
};

export default OverviewCard;
