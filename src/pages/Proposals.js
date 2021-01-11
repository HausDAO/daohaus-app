import React from "react";
import { utils } from "web3";

import {
  determineProposalStatus,
  determineProposalType,
  titleMaker,
  descriptionMaker,
} from "../utils/proposalUtils";

const Proposals = React.memo(function Overview({ proposals }) {
  console.log(proposals?.proposals);
  return (
    <ul>
      {proposals &&
        proposals.proposals.slice(0, 5).map((proposal) => (
          <li key={proposal.id}>
            <p>{determineProposalType(proposal)}</p>
            <h3>{titleMaker(proposal)}</h3>
            <p>{descriptionMaker(proposal)}</p>
            <p>{determineProposalStatus(proposal)}</p>
            <p>Yes: {proposal.yesShares}</p>
            <p>No: {proposal.noShares}</p>
            {proposal.paymentRequested > 0 && (
              <p>Payment Requested {proposal.paymentRequested}</p>
            )}

            {}
          </li>
        ))}
    </ul>
  );
});

export default Proposals;
