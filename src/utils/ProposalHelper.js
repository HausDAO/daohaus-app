import React, { Fragment } from 'react';

export const ProposalStatus = {
  Unknown: 'Unknown',
  InQueue: 'InQueue',
  VotingPeriod: 'VotingPeriod',
  GracePeriod: 'GracePeriod',
  Aborted: 'Aborted',
  Passed: 'Passed',
  Failed: 'Failed',
  ReadyForProcessing: 'ReadyForProcessing',
  Unsponsored: 'Unsponsored',
};

const periodsToTime = (periods, periodDuration) => {
  const seconds = periodDuration * periods;

  const days = Math.floor((seconds % 31536000) / 86400);
  const hours = Math.floor(((seconds % 31536000) % 86400) / 3600);
  const minutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);

  let string = '';
  string = days ? `${days} days` : string;
  string = hours ? `${string} ${hours} hours` : string;
  string = minutes ? `${string} ${minutes} minutes` : string;

  return string;
};

export function getProposalCountdownText(proposal, periodDuration) {
  switch (proposal.status) {
    case ProposalStatus.InQueue:
      return (
        <Fragment>
          <span className="subtext">Voting Begins: </span>
          <span>
            {proposal.votingStarts
              ? periodsToTime(proposal.votingStarts, periodDuration)
              : '-'}
          </span>
        </Fragment>
      );
    case ProposalStatus.VotingPeriod:
      return (
        <Fragment>
          <span className="subtext">Voting Ends: </span>
          <span>
            {proposal.votingEnds
              ? periodsToTime(proposal.votingEnds, periodDuration)
              : '-'}
          </span>
        </Fragment>
      );
    case ProposalStatus.GracePeriod:
      return (
        <Fragment>
          <span className="subtext">Grace Period Ends: </span>
          <span>
            {proposal.gracePeriod
              ? periodsToTime(proposal.gracePeriod, periodDuration)
              : '-'}
          </span>
        </Fragment>
      );
    case ProposalStatus.Passed:
      return <span className="subtext">Passed</span>;
    case ProposalStatus.Failed:
      return <span className="subtext">Failed</span>;
    case ProposalStatus.Aborted:
      return <span className="subtext">Aborted</span>;
    case ProposalStatus.ReadyForProcessing:
      return <span className="subtext">Ready For Processing</span>;
    case ProposalStatus.Unsponsored:
      return <span className="subtext">Unsponsored</span>;
    default:
      return <Fragment />;
  }
}

export const inQueue = (proposal, currentPeriod) =>
  currentPeriod < proposal.startingPeriod;

export const inGracePeriod = (
  proposal,
  currentPeriod,
  votingPeriodLength,
  gracePeriodLength,
) =>
  currentPeriod >= proposal.startingPeriod + votingPeriodLength &&
  currentPeriod <=
    proposal.startingPeriod + votingPeriodLength + gracePeriodLength;

export const inVotingPeriod = (proposal, currentPeriod, votingPeriodLength) =>
  currentPeriod >= proposal.startingPeriod &&
  currentPeriod <= proposal.startingPeriod + votingPeriodLength;

export const passedVotingAndGrace = (
  proposal,
  currentPeriod,
  votingPeriodLength,
  gracePeriodLength,
  version,
) => {
  if (version === 2 && !proposal.sponsored) {
    return false;
  } else {
    return (
      currentPeriod >
      proposal.startingPeriod + votingPeriodLength + gracePeriodLength
    );
  }
};

export function determineProposalStatus(
  proposal,
  currentPeriod,
  votingPeriodLength,
  gracePeriodLength,
  version,
) {
  proposal.startingPeriod = +proposal.startingPeriod;

  let status;
  // TODO: handle V2 - no aborted
  const abortedOrCancelled = proposal.aborted || proposal.cancelled;
  // if (proposal.processed && proposal.aborted) {
  if (proposal.processed && abortedOrCancelled) {
    status = ProposalStatus.Aborted;
  } else if (version === 2 && !proposal.sponsored) {
    status = ProposalStatus.Unsponsored;
  } else if (proposal.processed && proposal.didPass) {
    status = ProposalStatus.Passed;
  } else if (proposal.processed && !proposal.didPass) {
    status = ProposalStatus.Failed;
  } else if (
    inGracePeriod(
      proposal,
      currentPeriod,
      votingPeriodLength,
      gracePeriodLength,
    )
  ) {
    status = ProposalStatus.GracePeriod;
  } else if (inVotingPeriod(proposal, currentPeriod, votingPeriodLength)) {
    status = ProposalStatus.VotingPeriod;
  } else if (inQueue(proposal, currentPeriod, votingPeriodLength)) {
    status = ProposalStatus.InQueue;
  } else if (
    passedVotingAndGrace(
      proposal,
      currentPeriod,
      votingPeriodLength,
      gracePeriodLength,
    )
  ) {
    status = ProposalStatus.ReadyForProcessing;
  } else {
    status = ProposalStatus.Unknown;
  }

  return status;
}

export const groupByStatus = (proposals, unsponsoredView) => {
  return {
    Unsponsored: {
      Cancelled: proposals.filter((p) => p.cancelled),
      Unsponsored: proposals.filter((p) => {
        return unsponsoredView && !p.cancelled && !p.processed;
      }),
    },
    Base: {
      VotingPeriod: proposals.filter((p) => p.status === 'VotingPeriod'),
      GracePeriod: proposals.filter((p) => p.status === 'GracePeriod'),
      ReadyForProcessing: proposals
        .filter((p) => p.status === 'ReadyForProcessing')
        .sort((a, b) => a.proposalId - b.proposalId),
      InQueue: proposals.filter((p) => p.status === 'InQueue'),
      Completed: proposals.filter((p) => {
        return (
          // 'Aborted', 'Passed', 'Failed', 'Unknown'
          !unsponsoredView &&
          p.status !== 'VotingPeriod' &&
          p.status !== 'GracePeriod' &&
          p.status !== 'ReadyForProcessing' &&
          p.status !== 'InQueue'
        );
      }),
    },
  };
};

export const titleMaker = (proposal) => {
  const details = proposal.details.split('~');

  if (details[0] === 'id') {
    return details[3];
  } else if (details[0][0] === '{') {
    let parsedDetails;

    try {
      parsedDetails = JSON.parse(proposal.details);
      return parsedDetails.title;
    } catch {
      if (proposal.details && proposal.details.indexOf('link:') > -1) {
        const fixedDetail = proposal.details.replace('link:', '"link":');
        const fixedParsed = JSON.parse(fixedDetail);
        return fixedParsed.title;
      } else {
        console.log(`Couldn't parse JSON from metadata`);
        return `Proposal ${proposal.proposalIndex}`;
      }
    }
  } else {
    return proposal.details
      ? proposal.details
      : `Proposal ${proposal.proposalIndex}`;
  }
};

export const descriptionMaker = (proposal) => {
  try {
    const parsed = JSON.parse(proposal.details);
    return parsed.description;
  } catch (e) {
    if (proposal.details && proposal.details.indexOf('link:') > -1) {
      const fixedDetail = proposal.details.replace('link:', '"link":');
      const fixedParsed = JSON.parse(fixedDetail);
      return fixedParsed.details;
    } else {
      console.log(`Couldn't parse JSON from metadata`);
    }
  }
  return ``;
};

export const linkMaker = (proposal) => {
  try {
    const parsed = JSON.parse(proposal.details);
    return typeof parsed.link === 'function' ? null : parsed.link;
  } catch (e) {
    if (proposal.details && proposal.details.indexOf('link:') > -1) {
      return 'https://credits.raidguild.org/';
    } else {
      console.log(`Couldn't parse JSON from metadata`);
    }
  }
  return null;
};

export const determineProposalType = (proposal) => {
  if (proposal.newMember) {
    return 'Member Proposal';
  } else if (proposal.whitelist) {
    return 'Whitelist Token Proposal';
  } else if (proposal.guildkick) {
    return 'Guildkick Proposal';
  } else if (proposal.trade) {
    return 'Trade Proposal';
  } else {
    return 'Funding Proposal';
  }
};
