import { IsJsonString, timeToNow } from './general';

export const CCO_CONSTANTS = {
  WHITELIST_HOST: 'https://daohaus-cco.s3.amazonaws.com',
  METADATA_FIELDS: {
    tributeToken: '',
    tributeTokenSymbol: '',
    claimTokenAddress: '',
    claimTokenSymbol: '',
    ratio: '',
    raiseStartTime: '',
    raiseEndTime: '',
    claimPeriodStartTime: '',
    minTarget: '',
    maxTarget: '',
    maxContribution: '',
    minContribution: '',
  },
  METADATA_TEXTAREA_FIELDS: {
    whitelistReqs: '',
    projectDescription: '',
    faqs: '',
  },
  BOTS: [
    '0x9166a0bc06Dbf63b8a6f68808060D550c31AefD6',
    '0xC2207416886eF70E2E8e12515EFf83230489384B',
  ],
  DAOSQUARE_NETWORK: '0x2a',
  // DAOSQUARE_NETWORK: '0x64',
  DAOSQUARE_TOKEN_ADDRESS: '0xbd9908b0cdd50386f92efcc8e1d71766c2782df0',
  DAOSQUARE_TOKEN_NETWORK: '0x1',
};

export const countDownText = raiseData => {
  const now = new Date() / 1000;
  if (raiseData.raiseOver) {
    return 'Contribution period is complete';
  }
  if (now < raiseData.raiseStartTime) {
    return `Raise starts ${timeToNow(raiseData.raiseStartTime)}`;
  }
  return `Raise ends ${timeToNow(raiseData.raiseEndTime)}`;
};

export const claimCountDownText = claimStartTime => {
  const now = new Date() / 1000;
  if (now < claimStartTime) {
    return `Claiming begins ${timeToNow(claimStartTime)}`;
  }
  return `Claiming began ${timeToNow(claimStartTime)}`;
};

export const isCcoProposal = (proposal, round) => {
  // const START_TIME_OVERRIDE = 1615809574;

  const parsedDetails = IsJsonString(proposal.details)
    ? JSON.parse(proposal.details)
    : { cco: false };
  const failed = proposal.processed && !proposal.didPass;
  return (
    !proposal.cancelled &&
    proposal.sponsored &&
    parsedDetails.cco &&
    +proposal.createdAt >= +round.raiseStartTime &&
    // +proposal.createdAt >= START_TIME_OVERRIDE &&
    proposal.tributeToken === round.ccoToken.tokenAddress &&
    proposal.sharesRequested === '0' &&
    +proposal.lootRequested > 0 &&
    !failed
  );
};

export const isCcoProposalForAddress = (proposal, address, round) => {
  const parsedDetails = IsJsonString(proposal.details)
    ? JSON.parse(proposal.details)
    : { cco: false };
  const failed = proposal.processed && !proposal.didPass;
  return (
    !proposal.cancelled &&
    parsedDetails.cco &&
    address.toLowerCase() === proposal.applicant.toLowerCase() &&
    proposal.tributeToken === round.ccoToken.tokenAddress &&
    proposal.sharesRequested === '0' &&
    +proposal.lootRequested > 0 &&
    !failed
  );
};

export const contributionTotalValue = (proposals, round) => {
  const total = proposals.reduce((sum, prop) => {
    sum += +prop.tributeOffered;
    return sum;
  }, 0);

  return total / 10 ** +round.ccoToken.decimals;
};

export const isDaosquareCcoPath = (daoMetaData, location) => {
  return daoMetaData?.daosquarecco && location.pathname.split('/')[4] === 'cco';
};
