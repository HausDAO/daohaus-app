import React from "react";
import { useParams } from "react-router-dom";
import { utils } from "web3";
import ActivitiesFeed from "../components/activitiesFeed";
import { getProposalHistories } from "../utils/activities";

import { numberWithCommas, timeToNow } from "../utils/general";

import {
  determineProposalStatus,
  determineProposalType,
  titleMaker,
  descriptionMaker,
} from "../utils/proposalUtils";

const Proposal = ({ activities }) => {
  const { propid } = useParams();
  const currentProposal = activities
    ? activities?.proposals?.find((proposal) => proposal.proposalId === propid)
    : null;

  return (
    <>
      {currentProposal && (
        <>
          <div key={currentProposal.id} className="large-box">
            <p>{determineProposalType(currentProposal)}</p>
            <h3>{titleMaker(currentProposal)}</h3>
            <p>{descriptionMaker(currentProposal)}</p>
            <p>{determineProposalStatus(currentProposal)}</p>
            <p>{timeToNow(currentProposal.createdAt)}</p>
            <p>Yes: {currentProposal.yesShares}</p>
            <p>No: {currentProposal.noShares}</p>
            {currentProposal.paymentRequested > 0 && (
              <p>
                Payment Requested{" "}
                {numberWithCommas(
                  utils.fromWei(currentProposal.paymentRequested)
                )}
              </p>
            )}
          </div>
          <ActivitiesFeed
            limit={6}
            activities={currentProposal}
            hydrateFn={getProposalHistories}
          />
        </>
      )}
    </>
  );
};

export default Proposal;
