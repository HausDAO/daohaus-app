import React, { Fragment } from 'react';
import { Box } from '@chakra-ui/react';

import { timeToNow } from './helpers';

export const ProposalStatus = {
  Unknown: 'Unknown',
  InQueue: 'InQueue',
  VotingPeriod: 'VotingPeriod',
  GracePeriod: 'GracePeriod',
  Cancelled: 'Cancelled',
  Passed: 'Passed',
  Failed: 'Failed',
  ReadyForProcessing: 'ReadyForProcessing',
  Unsponsored: 'Unsponsored',
};

export const inQueue = (proposal, currentPeriod) =>
  currentPeriod < proposal.startingPeriod;

export const inGracePeriod = (
  proposal,
  currentPeriod,
  votingPeriodLength,
  gracePeriodLength,
) =>
  currentPeriod >= proposal.startingPeriod + votingPeriodLength &&
  currentPeriod <
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
      currentPeriod >=
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
  const abortedOrCancelled = proposal.aborted || proposal.cancelled;
  // if (proposal.processed && abortedOrCancelled) {
  if (abortedOrCancelled) {
    status = ProposalStatus.Cancelled;
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

export const determineProposalType = (proposal) => {
  if (proposal.molochVersion === '1') {
    return 'V1 Proposal';
  } else if (proposal.newMember) {
    return 'Member Proposal';
  } else if (proposal.whitelist) {
    return 'Whitelist Token Proposal';
  } else if (proposal.guildkick) {
    return 'Guildkick Proposal';
  } else if (proposal.trade) {
    return 'Trade Proposal';
  } else if (proposal.isMinion) {
    return 'Minion Proposal';
  } else {
    return 'Funding Proposal';
  }
};

export const determineUnreadActivityFeed = (proposal) => {
  const abortedOrCancelled = proposal.aborted || proposal.cancelled;
  const now = (new Date() / 1000) | 0;
  const inVotingPeriod =
    now >= +proposal.votingPeriodStart && now <= +proposal.votingPeriodEnds;
  const needsMemberVote = inVotingPeriod && !proposal.votes.length;
  const needsProcessing =
    now >= +proposal.gracePeriodEnds && !proposal.processed;

  let message;
  if (!proposal.sponsored) {
    message = 'New and unsponsored';
  }
  if (needsProcessing) {
    message = 'Unprocessed';
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

export const determineUnreadProposalList = (
  proposal,
  activeMember,
  memberAddress,
) => {
  const abortedOrCancelled = proposal.aborted || proposal.cancelled;
  const now = (new Date() / 1000) | 0;
  const inVotingPeriod =
    now >= +proposal.votingPeriodStart && now <= +proposal.votingPeriodEnds;

  const memberVoted = proposal.votes.some(
    (vote) => vote.memberAddress.toLowerCase() === memberAddress.toLowerCase(),
  );
  const needsMemberVote = activeMember && inVotingPeriod && !memberVoted;

  const needsProcessing =
    now >= +proposal.gracePeriodEnds && !proposal.processed;

  let message;
  if (!proposal.sponsored) {
    message = 'New and unsponsored';
  }
  if (needsProcessing) {
    message = 'Unprocessed';
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

export const detailsToJSON = (values) => {
  const details = {};
  details.title = values.title;
  // random string
  details.hash = Math.random()
    .toString(36)
    .slice(2);
  if (values.description) {
    details.description = values.description;
  }
  if (values.link) {
    details.link = values.link;
  }
  return JSON.stringify(details);
};

export const titleMaker = (proposal) => {
  const details = proposal.details.split('~');

  if (details[0] === 'id') {
    return details[3];
  } else if (details[0][0] === '{') {
    let parsedDetails;

    try {
      parsedDetails = JSON.parse(
        proposal.details.replace(/(\r\n|\n|\r)/gm, ''),
      );
      return parsedDetails.title || '';
    } catch {
      // one off fix for a bad proposal
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
    const parsed = JSON.parse(proposal.details.replace(/(\r\n|\n|\r)/gm, ''));
    return parsed.description;
  } catch (e) {
    console.log('error', e);
    return ``;
  }
};

export const hashMaker = (proposal) => {
  try {
    const parsed = JSON.parse(proposal.details.replace(/(\r\n|\n|\r)/gm, ''));
    return parsed.hash || '';
  } catch (e) {
    return '';
  }
};

export const linkMaker = (proposal) => {
  try {
    const parsed = JSON.parse(proposal.details.replace(/(\r\n|\n|\r)/gm, ''));
    return typeof parsed.link === 'function' ? null : parsed.link;
  } catch (e) {
    console.log('error', e);
    return null;
  }
};

export const isMinion = (proposal) => {
  try {
    const parsed = JSON.parse(proposal.details.replace(/(\r\n|\n|\r)/gm, ''));
    return {
      isMinion: parsed.isMinion,
      isTransmutation: parsed.isTransmutation,
    };
  } catch (e) {
    if (proposal.details && proposal.details.indexOf('link:') > -1) {
      const fixedDetail = proposal.details.replace('link:', '"link":');
      const fixedParsed = JSON.parse(fixedDetail);
      return {
        isMinion: fixedParsed.isMinion,
        isTransmutation: fixedParsed.isTransmutation,
      };
    } else {
      console.log(`Couldn't parse JSON from metadata`);
      return {
        isMinion: false,
        isTransmutation: false,
      };
    }
  }
};

export function getProposalCountdownText(proposal) {
  switch (proposal.status) {
    case ProposalStatus.InQueue:
      return (
        <Fragment>
          <Box textTransform='uppercase' fontSize='0.8em' fontWeight={700}>
            <span fontWeight='700'>Voting Begins</span>
            {timeToNow(proposal.votingPeriodStarts)}
          </Box>
        </Fragment>
      );
    case ProposalStatus.VotingPeriod:
      return (
        <Fragment>
          <Box textTransform='uppercase' fontSize='0.8em' fontWeight={700}>
            Voting Ends: {timeToNow(proposal.votingPeriodEnds)}
          </Box>
        </Fragment>
      );
    case ProposalStatus.GracePeriod:
      return (
        <Fragment>
          <Box textTransform='uppercase' fontSize='0.8em' fontWeight={700}>
            <Box as='span' fontWeight={900}>
              Grace Period Ends
            </Box>{' '}
            {timeToNow(proposal.gracePeriodEnds)}
          </Box>
        </Fragment>
      );
    case ProposalStatus.Passed:
      return (
        <Box textTransform='uppercase' fontSize='0.8em' fontWeight={700}>
          Passed
        </Box>
      );
    case ProposalStatus.Failed:
      return (
        <Box textTransform='uppercase' fontSize='0.8em' fontWeight={700}>
          Failed
        </Box>
      );
    case ProposalStatus.Cancelled:
      return (
        <Box textTransform='uppercase' fontSize='0.8em' fontWeight={700}>
          Cancelled
        </Box>
      );
    case ProposalStatus.ReadyForProcessing:
      return (
        <Box textTransform='uppercase' fontSize='0.8em' fontWeight={700}>
          Ready For Processing
        </Box>
      );
    case ProposalStatus.Unsponsored:
      return (
        <Box textTransform='uppercase' fontSize='0.8em' fontWeight={700}>
          Unsponsored
        </Box>
      );
    default:
      return <Fragment />;
  }
}
