import { timeToNow } from './general';

export const countDownText = (round) => {
  const now = new Date() / 1000;
  if (now < round.startTime) {
    return `Round ${round.round} starts ${timeToNow(round.startTime)}`;
  } else {
    return `Round ${round.round} ends ${timeToNow(round.endTime)}`;
  }
};

export const claimCountDownText = (claimStartTime) => {
  const now = new Date() / 1000;
  if (now < claimStartTime) {
    return `Claiming begins ${timeToNow(claimStartTime)}`;
  } else {
    return `Claiming began ${timeToNow(claimStartTime)}`;
  }
};

export const isCcoProposal = (proposal, round) => {
  return (
    !proposal.cancelled &&
    +proposal.createdAt > +round.raiseStartTime &&
    proposal.tributeToken === round.ccoToken.tokenAddress &&
    proposal.sharesRequested === '0' &&
    +proposal.lootRequested > 0
  );
};

export const isCcoProposalForAddress = (proposal, address, round) => {
  return (
    !proposal.cancelled &&
    address.toLowerCase() === proposal.applicant.toLowerCase() &&
    proposal.tributeToken === round.ccoToken.tokenAddress &&
    proposal.sharesRequested === '0' &&
    +proposal.lootRequested > 0
  );
};

export const contributionTotalValue = (proposals, round) => {
  const total = proposals.reduce((sum, prop) => {
    sum += +prop.tributeOffered;
    return sum;
  }, 0);

  return total / 10 ** +round.ccoToken.decimals;
};
