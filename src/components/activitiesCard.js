import React from "react";
import styled from "styled-components";
import { BodyLg, BodyMd, HeaderLg } from "../styles/typography";
import { parseIfJSON } from "../utils/general";

const StyledActivitesCard = styled.div`
  grid-row: 2;
  grid-column: 3/5;
  .box {
    margin-bottom: 0.8rem;
  }
`;

const ActivitesCard = ({ activities }) => {
  const samples = activities.moloch.proposals.slice(0, 9);
  return (
    <StyledActivitesCard>
      <HeaderLg>Activites</HeaderLg>
      {samples.map((sample) => {
        const details = parseIfJSON(sample.details);
        return (
          <div key={sample.id} className="box">
            <BodyLg>{details?.title}</BodyLg>
            <BodyMd>{details?.description}</BodyMd>
          </div>
        );
      })}
    </StyledActivitesCard>
  );
};

export default ActivitesCard;
