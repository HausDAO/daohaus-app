import { IsJsonString } from "./general";

export const ProposalStatus = {
  Unknown: "Unknown",
  InQueue: "InQueue",
  VotingPeriod: "VotingPeriod",
  GracePeriod: "GracePeriod",
  Cancelled: "Cancelled",
  Passed: "Passed",
  Failed: "Failed",
  ReadyForProcessing: "ReadyForProcessing",
  Unsponsored: "Unsponsored",
};

export const inQueue = (proposal) => {
  const now = (new Date() / 1000) | 0;
  return now < +proposal.votingPeriodStarts;
};

export const inVotingPeriod = (proposal) => {
  const now = (new Date() / 1000) | 0;
  return (
    now >= +proposal.votingPeriodStarts && now <= +proposal.votingPeriodEnds
  );
};

export const inGracePeriod = (proposal) => {
  const now = (new Date() / 1000) | 0;
  return now >= +proposal.votingPeriodEnds && now <= +proposal.gracePeriodEnds;
};

export const afterGracePeriod = (proposal) => {
  const now = (new Date() / 1000) | 0;
  return now > +proposal.gracePeriodEnds;
};

export function determineProposalStatus(proposal) {
  let status;

  if (proposal.cancelled) {
    status = ProposalStatus.Cancelled;
  } else if (!proposal.sponsored) {
    status = ProposalStatus.Unsponsored;
  } else if (proposal.processed && proposal.didPass) {
    status = ProposalStatus.Passed;
  } else if (proposal.processed && !proposal.didPass) {
    status = ProposalStatus.Failed;
  } else if (inQueue(proposal)) {
    status = ProposalStatus.InQueue;
  } else if (inVotingPeriod(proposal)) {
    status = ProposalStatus.VotingPeriod;
  } else if (inGracePeriod(proposal)) {
    status = ProposalStatus.GracePeriod;
  } else if (afterGracePeriod(proposal)) {
    status = ProposalStatus.ReadyForProcessing;
  } else {
    status = ProposalStatus.Unknown;
  }

  return status;
}
export const determineProposalType = (proposal) => {
  if (proposal.newMember) {
    return "Member Proposal";
  } else if (proposal.whitelist) {
    return "Whitelist Token Proposal";
  } else if (proposal.guildkick) {
    return "Guildkick Proposal";
  } else if (proposal.trade) {
    return "Trade Proposal";
  } else if (proposal.isMinion) {
    return "Minion Proposal";
  } else {
    return "Funding Proposal";
  }
};
export const titleMaker = (proposal) => {
  const details = proposal.details.split("~");

  if (details[0] === "id") {
    return details[3];
  } else if (details[0][0] === "{") {
    let parsedDetails;

    try {
      parsedDetails = IsJsonString(proposal.details)
        ? JSON.parse(proposal.details.replace(/(\r\n|\n|\r)/gm, ""))
        : "";
      return parsedDetails.title || "";
    } catch {
      console.log(`Couldn't parse JSON from metadata`);
      return `Proposal ${proposal.proposalIndex}`;
    }
  } else {
    return proposal.details
      ? proposal.details
      : `Proposal ${proposal.proposalIndex}`;
  }
};
export const hashMaker = (proposal) => {
  try {
    const parsed =
      IsJsonString(proposal.details) && JSON.parse(proposal.details);
    return parsed.hash || "";
  } catch (e) {
    return "";
  }
};

export const descriptionMaker = (proposal) => {
  try {
    const parsed = IsJsonString(proposal.details)
      ? JSON.parse(proposal.details.replace(/(\r\n|\n|\r)/gm, ""))
      : "";
    return parsed.description || "";
  } catch (e) {
    return "";
  }
};
export const determineUnreadActivityFeed = (proposal) => {
  const abortedOrCancelled = proposal.aborted || proposal.cancelled;
  const now = (new Date() / 1000) | 0;
  const inVotingPeriod =
    now >= +proposal.votingPeriodStarts && now <= +proposal.votingPeriodEnds;
  const needsMemberVote = inVotingPeriod && !proposal.votes.length;
  const needsProcessing =
    now >= +proposal.gracePeriodEnds && !proposal.processed;

  let message;
  if (!proposal.sponsored) {
    message = "New and unsponsored";
  }
  if (needsProcessing) {
    message = "Unprocessed";
  }
  if (needsMemberVote) {
    message = "You haven't voted on this";
  }

  return {
    unread:
      !abortedOrCancelled &&
      (needsMemberVote || needsProcessing || !proposal.sponsored),
    message,
  };
};
