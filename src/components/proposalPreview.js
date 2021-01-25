import React from "react";

const ProposalPreview = ({ proposal }) => {
  return (
    <div>
      <p className="location">
        {proposal.name} - {proposal.chain}
      </p>
      <p className="details">
        {proposal.details.title ? proposal.details.title : proposal.details}
      </p>
      <div className="status-box">
        <p>{proposal.processed ? "Processed" : "Unprocessed"}</p>
        <p>Yes: {proposal.noVotes}</p>
        <p>No: {proposal.yesVotes}</p>
      </div>
    </div>

    //dao
    //description
    //processStatus
    //votes yes
    //votes no
  );
};

export default ProposalPreview;
