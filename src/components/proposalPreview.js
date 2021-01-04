import React from "react";
import styled from "styled-components";
import { BodyMd, BodySm, Overline } from "../styles/typography";
import { Divider } from "./staticElements";

const StyledProposalPreview = styled.div`
  margin-bottom: 1.6rem;
  .location {
    margin-bottom: 0.8rem;
  }
  .divider {
    margin-bottom: 0.8rem;
  }
  .status-box {
    display: flex;
    margin-bottom: 0.8rem;
    p {
      margin-right: 0.8rem;
    }
  }
`;

const ProposalPreview = ({ proposal }) => {
  return (
    <StyledProposalPreview>
      <Overline className="location">
        {proposal.name} - {proposal.chain}
      </Overline>
      <BodyMd className="details">
        {proposal.details.title ? proposal.details.title : proposal.details}
      </BodyMd>
      <div className="status-box">
        <BodySm>{proposal.processed ? "Processed" : "Unprocessed"}</BodySm>
        <BodySm>Yes: {proposal.noVotes}</BodySm>
        <BodySm>No: {proposal.yesVotes}</BodySm>
      </div>
      <Divider className="divider" />
    </StyledProposalPreview>

    //dao
    //description
    //processStatus
    //votes yes
    //votes no
  );
};

export default ProposalPreview;
