import React from "react";
import styled from "styled-components";
import { BodyLg, BodyMd, HeaderLg } from "../styles/typography";
import { parseIfJSON } from "../utils/general";

const ActivitesCard = ({ activities }) => {
  const samples = activities.moloch.proposals.slice(0, 9);
  return (
    <div>
      <h3>Activites</h3>
      {samples.map((sample) => {
        const details = parseIfJSON(sample.details);
        return (
          <div key={sample.id} className="box">
            <p>{details?.title}</p>
            <p>{details?.description}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ActivitesCard;
