import React, { Fragment } from 'react';
import { Box } from '@chakra-ui/react';

import { IsJsonString, timeToNow } from './helpers';
import TextBox from '../components/Shared/TextBox';
import { formatDistanceToNow } from 'date-fns';

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
    now >= +proposal.votingPeriodStarts && now <= +proposal.votingPeriodEnds;
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
    now >= +proposal.votingPeriodStarts && now <= +proposal.votingPeriodEnds;

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
      parsedDetails = IsJsonString(proposal.details)
        ? JSON.parse(proposal.details.replace(/(\r\n|\n|\r)/gm, ''))
        : '';
      return parsedDetails.title || '';
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

export const descriptionMaker = (proposal) => {
  try {
    const parsed = IsJsonString(proposal.details)
      ? JSON.parse(proposal.details.replace(/(\r\n|\n|\r)/gm, ''))
      : '';
    return parsed.description || '';
  } catch (e) {
    return '';
  }
};

export const hashMaker = (proposal) => {
  try {
    const parsed =
      IsJsonString(proposal.details) && JSON.parse(proposal.details);
    return parsed.hash || '';
  } catch (e) {
    return '';
  }
};

export const linkMaker = (proposal) => {
  try {
    const parsed =
      IsJsonString(proposal.details) &&
      JSON.parse(proposal.details.replace(/(\r\n|\n|\r)/gm, ''));
    return typeof parsed.link === 'function' ? null : parsed.link || '';
  } catch (e) {
    return '';
  }
};

export const isMinion = (proposal) => {
  console.log('parsed', proposal);
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
            Voting Begins {timeToNow(proposal.votingPeriodStarts)}
          </Box>
        </Fragment>
      );
    case ProposalStatus.VotingPeriod:
      return (
        <Fragment>
          <Box textTransform='uppercase' fontSize='0.8em' fontWeight={700}>
            Voting Ends {timeToNow(proposal.votingPeriodEnds)}
          </Box>
        </Fragment>
      );
    case ProposalStatus.GracePeriod:
      return (
        <Fragment>
          <Box textTransform='uppercase' fontSize='0.8em' fontWeight={700}>
            <Box as='span' fontWeight={900}>
              Grace Period Ends {timeToNow(proposal.gracePeriodEnds)}
            </Box>
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

export const getProposalDetailStatus = (proposal) => {
  switch (proposal.status) {
    case ProposalStatus.InQueue:
      return (
        <>
          <TextBox size='xs'>In Queue, Voting Begins</TextBox>
          <TextBox size='lg' variant='value'>
            {formatDistanceToNow(
              new Date(+proposal?.votingPeriodStarts * 1000),
              {
                addSuffix: true,
              },
            )}
          </TextBox>
        </>
      );
    case ProposalStatus.VotingPeriod:
      return (
        <>
          <TextBox size='xs'>Voting Ends</TextBox>
          <TextBox size='lg' variant='value'>
            {formatDistanceToNow(new Date(+proposal?.votingPeriodEnds * 1000), {
              addSuffix: true,
            })}
          </TextBox>
        </>
      );
    case ProposalStatus.GracePeriod:
      return (
        <>
          <TextBox size='xs'>Grace Period Ends</TextBox>
          <TextBox size='lg' variant='value'>
            {formatDistanceToNow(new Date(+proposal?.gracePeriodEnds * 1000), {
              addSuffix: true,
            })}
          </TextBox>
        </>
      );
    case ProposalStatus.ReadyForProcessing:
      return (
        <>
          <TextBox size='xs'>Ready For Processing</TextBox>
          <TextBox size='lg' variant='value'>
            {formatDistanceToNow(new Date(+proposal?.gracePeriodEnds * 1000), {
              addSuffix: true,
            })}
          </TextBox>
        </>
      );
    case ProposalStatus.Passed:
    case ProposalStatus.Failed:
      return (
        <>
          <TextBox size='xs'>{proposal.status}</TextBox>
          <TextBox size='lg' variant='value'>
            {formatDistanceToNow(new Date(+proposal?.gracePeriodEnds * 1000), {
              addSuffix: true,
            })}
          </TextBox>
        </>
      );
    default:
      return <Fragment />;
  }
};
