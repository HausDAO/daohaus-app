import React from "react";
import { utils } from "web3";
import { numberWithCommas } from "../utils/general";

import {
  determineProposalStatus,
  determineProposalType,
  titleMaker,
  descriptionMaker,
} from "../utils/proposalUtils";

const Proposals = React.memo(function Overview({ proposals, activity }) {
  return (
    <ul>
      {proposals &&
        proposals.proposals.slice(0, 5).map((proposal) => (
          <li key={proposal.id} className="large-box">
            <p>{determineProposalType(proposal)}</p>
            <h3>{titleMaker(proposal)}</h3>
            <p>{descriptionMaker(proposal)}</p>
            <p>{determineProposalStatus(proposal)}</p>
            <p>Yes: {proposal.yesShares}</p>
            <p>No: {proposal.noShares}</p>
            {proposal.paymentRequested > 0 && (
              <p>
                Payment Requested{" "}
                {numberWithCommas(utils.fromWei(proposal.paymentRequested))}
              </p>
            )}
          </li>
        ))}
    </ul>
  );
});

export default Proposals;
