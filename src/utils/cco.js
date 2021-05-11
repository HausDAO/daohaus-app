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

const parsedCcoDetails = proposal => {
  return IsJsonString(proposal.details)
    ? JSON.parse(proposal.details)
    : { cco: false };
};

export const countDownText = raiseData => {
  const now = new Date() / 1000;
  if (raiseData.raiseOver) {
    return 'Contribution period is complete';
  }
  if (now < raiseData.raiseStartTime) {
    return `CCO starts ${timeToNow(raiseData.raiseStartTime)}`;
  }
  return `CCO ends ${timeToNow(raiseData.raiseEndTime)}`;
};

export const claimCountDownText = claimStartTime => {
  const now = new Date() / 1000;
  if (now < claimStartTime) {
    return `Claiming begins ${timeToNow(claimStartTime)}`;
  }
  return `Claiming began ${timeToNow(claimStartTime)}`;
};

export const isCcoProposal = (proposal, round) => {
  const failed = proposal.processed && !proposal.didPass;
  return (
    !proposal.cancelled &&
    parsedCcoDetails(proposal).cco === round.ccoId &&
    Number(proposal.createdAt) >= Number(round.raiseStartTime) &&
    Number(proposal.createdAt) <= Number(round.raiseEndTime) &&
    proposal.tributeToken === round.tributeToken &&
    proposal.sharesRequested === '0' &&
    Number(proposal.lootRequested) > 0 &&
    !failed
  );
};

export const isCcoProposalForAddress = (proposal, address, round) => {
  const failed = proposal.processed && !proposal.didPass;
  return (
    !proposal.cancelled &&
    parsedCcoDetails(proposal).cco === round.ccoId &&
    address.toLowerCase() === proposal.applicant.toLowerCase() &&
    proposal.tributeToken === round.tributeToken &&
    proposal.sharesRequested === '0' &&
    +proposal.lootRequested > 0 &&
    !failed
  );
};

export const contributionTotalValue = args => {
  let overTime = null;
  const totalMaxWei = Number(args.round.maxTarget) * 10 ** 18;
  const total = args.proposals
    .sort((a, b) => {
      return +b.createdAt - +a.createdAt;
    })
    .reduce((sum, prop) => {
      const nextSum = Number(prop.tributeOffered) + sum;
      const isUnder = args.allProposals
        ? nextSum < totalMaxWei
        : !args.overTime;
      if (isUnder) {
        sum = nextSum;
      } else {
        overTime = !overTime ? prop.createdAt : overTime;
      }
      return sum;
    }, 0);

  if (args.allProposals) {
    return {
      contributionTotal: total / 10 ** Number(args.round.ccoToken.decimals),
      overTime,
    };
  }
  return total / 10 ** Number(args.round.ccoToken.decimals);
};

export const isDaosquareCcoPath = (daoMetaData, location) => {
  return (
    daoMetaData?.daosquarecco === 1 && location.pathname.split('/')[4] === 'cco'
  );
};

export const currentFunded = (ccoData, proposals) => {
  const totalMaxWei = Number(ccoData.maxTarget) * 10 ** 18;
  return proposals.reduce((sum, prop) => {
    const nextSum = Number(prop.tributeOffered) + sum;
    if (isCcoProposal(prop, ccoData) && nextSum < totalMaxWei) {
      sum = nextSum;
    }
    return sum;
  }, 0);
};

export const totalFundedDaosquare = daos => {
  return daos.reduce((sum, dao) => {
    if (dao.ccoStatus.label === 'Funded') {
      sum += dao.ccoFundedAmount;
    }
    return sum;
  }, 0);
};

export const ccoStatus = (ccoData, ccoFundedAmount, now) => {
  if (Number(ccoData.raiseStartTime) > now) {
    return {
      label: 'Coming Soon',
    };
  }
  if (ccoFundedAmount >= Number(ccoData.maxTarget)) {
    return {
      label: 'Funded',
      claimOpen: now >= Number(ccoData.claimPeriodStartTime),
    };
  }
  if (
    Number(ccoData.raiseStartTime) < now &&
    Number(ccoData.raiseEndTime) > now
  ) {
    return { label: 'Active' };
  }
  if (
    Number(ccoData.raiseEndTime) > now &&
    ccoFundedAmount < Number(ccoData.maxTarget)
  ) {
    return { label: 'Failed' };
  }

  return null;
};
