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
    rewards: '',
    faqLink: '',
  },
  BOTS: [
    '0x9166a0bc06Dbf63b8a6f68808060D550c31AefD6',
    '0xC2207416886eF70E2E8e12515EFf83230489384B',
  ],
  // DAOSQUARE_NETWORK: '0x2a',
  DAOSQUARE_NETWORK: '0x64',
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
  const maxWei = round.maxContribution * 10 ** 18;

  return (
    !proposal.cancelled &&
    parsedCcoDetails(proposal).cco === round.ccoId &&
    Number(proposal.createdAt) >= Number(round.raiseStartTime) &&
    Number(proposal.createdAt) <= Number(round.raiseEndTime) &&
    proposal.tributeToken.toLowerCase() === round.tributeToken.toLowerCase() &&
    proposal.tributeOffered <= maxWei &&
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
      return +a.createdAt - +b.createdAt;
    })
    .reduce((sum, prop) => {
      const nextSum = Number(prop.tributeOffered) + sum;
      const isUnder = args.allProposals
        ? nextSum <= totalMaxWei
        : args.overTime
        ? Number(args.overTime) >= Number(prop.createdAt)
        : true;
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
  return proposals
    .sort((a, b) => {
      return Number(b.createdAt) - Number(a.createdAt);
    })
    .reduce((sum, prop) => {
      const nextSum = Number(prop.tributeOffered) + sum;
      if (isCcoProposal(prop, ccoData) && nextSum <= totalMaxWei) {
        sum = nextSum;
      }

      // if (nextSum <= totalMaxWei) {
      //   console.log(prop);
      // }
      return sum;
    }, 0);
};

export const ccoStatus = (ccoData, ccoFundedAmount, now) => {
  if (!ccoData.active) {
    return {
      label: 'Paused',
      sort: 4,
    };
  }
  if (Number(ccoData.metadata.raiseStartTime) > now) {
    return {
      label: 'Coming Soon',
      sort: 2,
    };
  }
  if (ccoFundedAmount >= Number(ccoData.metadata.minTarget)) {
    return {
      label: 'Funded',
      claimOpen: now >= Number(ccoData.metadata.claimPeriodStartTime),
      sort: 3,
    };
  }
  if (
    Number(ccoData.metadata.raiseStartTime) < now &&
    Number(ccoData.metadata.raiseEndTime) > now
  ) {
    return { label: 'Active', sort: 1 };
  }
  if (
    Number(ccoData.metadata.raiseEndTime) < now &&
    ccoFundedAmount < Number(ccoData.metadata.minTarget)
  ) {
    return { label: 'Failed', sort: 5 };
  }

  console.log(ccoData, ccoFundedAmount, now);

  return null;
};

export const ccoProgressBarData = (metadata, ccoFundedAmount) => {
  const minBarWidth = Number(metadata.minTarget) / Number(metadata.maxTarget);
  const maxBarWidth = 1.0 - minBarWidth;
  const minBarValue = ccoFundedAmount / Number(metadata.minTarget);
  const maxCurrentContributions = ccoFundedAmount - Number(metadata.minTarget);
  const maxBarValue =
    (maxCurrentContributions >= 0 ? maxCurrentContributions : 0) /
    (Number(metadata.maxTarget) - Number(metadata.minTarget));

  return { minBarWidth, maxBarWidth, minBarValue, maxBarValue };
};
