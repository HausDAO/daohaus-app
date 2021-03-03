import React, { Fragment } from 'react';
import { Box } from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import { IsJsonString, timeToNow } from './general';
import TextBox from '../components/TextBox';

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
  if (proposal.cancelled) {
    return ProposalStatus.Cancelled;
  } else if (!proposal.sponsored) {
    return ProposalStatus.Unsponsored;
  } else if (proposal.processed && proposal.didPass) {
    return ProposalStatus.Passed;
  } else if (proposal.processed && !proposal.didPass) {
    return ProposalStatus.Failed;
  } else if (inVotingPeriod(proposal)) {
    return ProposalStatus.VotingPeriod;
  } else if (inQueue(proposal)) {
    return ProposalStatus.InQueue;
  } else if (inGracePeriod(proposal)) {
    return ProposalStatus.GracePeriod;
  } else if (afterGracePeriod(proposal)) {
    return ProposalStatus.ReadyForProcessing;
  } else {
    return ProposalStatus.Unknown;
  }
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

export const titleMaker = (proposal) => {
  const details = proposal.details.split('~');
  if (details[0] === 'id') {
    return details[3];
  } else if (details[0][0] === '{') {
    let parsedDetails;

    try {
      // console.log('proposal.details', proposal.details);
      // console.log(IsJsonString(proposal.details));
      parsedDetails = IsJsonString(proposal.details)
        ? JSON.parse(proposal.details.replace(/(\r\n|\n|\r)/gm, ''))
        : '';
      return parsedDetails.title || 'Whoops! Could not parse JSON data';
    } catch {
      console.log(`Couldn't parse JSON from metadata`);
      return `Proposal`;
    }
  } else {
    return proposal.details ? proposal.details : `Proposal`;
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

export const linkMaker = (proposal) => {
  try {
    const parsed =
      IsJsonString(proposal.details) && JSON.parse(proposal.details);
    return parsed.link || '';
  } catch (e) {
    return '';
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

  let memberVoted = false;
  if (memberAddress) {
    memberVoted = proposal.votes.some(
      (vote) =>
        vote.memberAddress.toLowerCase() === memberAddress.toLowerCase(),
    );
  }
  const needsMemberVote =
    proposal.sponsored && activeMember && inVotingPeriod && !memberVoted;

  const needsProcessing =
    proposal.sponsored &&
    now >= +proposal.gracePeriodEnds &&
    !proposal.processed;

  const twoWeeksAgo = ((new Date() / 1000) | 0) - 1.21e6;
  const unsponsoredAndNotExpired =
    !proposal.sponsored && +proposal.createdAt > twoWeeksAgo;

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
      (needsMemberVote || needsProcessing || unsponsoredAndNotExpired),
    message,
  };
};

export function getProposalCountdownText(proposal, status) {
  switch (status) {
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
    case ProposalStatus.GracePeriodEnds:
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

export const getProposalCardDetailStatus = (proposal, status) => {
  switch (status) {
    case ProposalStatus.InQueue:
      return (
        'Voting Begins ' +
        formatDistanceToNow(new Date(+proposal?.votingPeriodStarts * 1000), {
          addSuffix: true,
        })
      );
    case ProposalStatus.VotingPeriod:
      return (
        'Ends ' +
        formatDistanceToNow(new Date(+proposal?.votingPeriodEnds * 1000), {
          addSuffix: true,
        })
      );
    case ProposalStatus.GracePeriod:
      return (
        'Ends ' +
        formatDistanceToNow(new Date(+proposal?.gracePeriodEnds * 1000), {
          addSuffix: true,
        })
      );
    case ProposalStatus.Failed:
    case ProposalStatus.Passed:
    case ProposalStatus.ReadyForProcessing:
      return formatDistanceToNow(new Date(+proposal?.gracePeriodEnds * 1000), {
        addSuffix: true,
      });
    default:
      return <Fragment />;
  }
};

export const getProposalDetailStatus = (proposal, status) => {
  switch (status) {
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

// return boolean as to whether user voted on a given proposal
export const memberVote = (proposal, userAddress) => {
  const vote = proposal
    ? proposal?.votes?.find(
        (vote) => vote.memberAddress === userAddress?.toLowerCase(),
      )
    : null;
  return vote ? vote.uintVote : null;
};

export const handleListFilter = (proposals, filter, daoMember) => {
  const updatedProposals = proposals.map((proposal) => ({
    ...proposal,
    status: determineProposalStatus(proposal),
  }));
  if (filter.value === 'All') {
    return updatedProposals;
  } else if (filter.value === 'Action Needed' || filter.value === 'Active') {
    return updatedProposals.filter(
      (proposal) =>
        determineUnreadProposalList(proposal, true, daoMember?.memberAddress)
          ?.unread,
    );
  } else {
    return updatedProposals.filter(
      (proposal) => proposal[filter.type] === filter.value,
    );
  }
};

export const handleListSort = (proposals, sort) => {
  if (sort.value === 'submissionDateAsc') {
    return proposals.sort((a, b) => +a.createdAt - +b.createdAt);
  } else if (sort.value === 'voteCountDesc') {
    return proposals
      .sort((a, b) => b.votes.length - a.votes.length)
      .sort((a, b) => (a.status === sort.value ? -1 : 1));
  } else if (sort.value === 'submissionDateDesc') {
    return proposals.sort((a, b) => +b.createdAt - +a.createdAt);
  } else {
    console.error('Received incorrect sort data type');
    return proposals;
  }
};

export const searchProposals = (rawAddress, filterArr, proposals) => {
  const activeFilters = filterArr.filter((f) => f.active);
  const address = rawAddress.toLowerCase();
  return proposals.filter((proposal) =>
    activeFilters.some(
      (filter) => proposal[filter.value] === address && proposal,
    ),
  );
};
