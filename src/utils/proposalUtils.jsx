import React from 'react';
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

export const PROPOSAL_TYPES = {
  MEMBER: 'Member Proposal',
  WHITELIST: 'Whitelist Token Proposal',
  GUILDKICK: 'Guild Kick Proposal',
  TRADE: 'Trade Proposal',
  MINION_UBER_STAKE: 'UberHAUS Staking Proposal',
  MINION_UBER_RQ: 'UberHAUS RageQuit Proposal',
  MINION_UBER_DEL: 'UberHAUS Delegate Proposal',
  MINION_UBER_DEFAULT: 'UberHAUS Minion Proposal',
  MINION_DEFAULT: 'Minion Proposal',
  MINION_VANILLA: 'Vanilla Minion',
  MINION_SUPERFLUID: 'Superfluid Proposal',
  TRANSMUTATION: 'Transmutation Proposal',
  FUNDING: 'Funding Proposal',
};

export const MINION_TYPES = {
  VANILLA: 'vanilla minion',
  UBER: 'UberHaus minion',
  SUPERFLUID: 'Superfluid minion',
};

export const inQueue = proposal => {
  const now = new Date() / 1000 || 0;
  return now < +proposal.votingPeriodStarts;
};

export const inVotingPeriod = proposal => {
  const now = new Date() / 1000 || 0;
  return (
    now >= +proposal.votingPeriodStarts && now <= +proposal.votingPeriodEnds
  );
};

export const inGracePeriod = proposal => {
  const now = new Date() / 1000 || 0;
  return now >= +proposal.votingPeriodEnds && now <= +proposal.gracePeriodEnds;
};

export const afterGracePeriod = proposal => {
  const now = new Date() / 1000 || 0;
  return now > +proposal.gracePeriodEnds;
};

export function determineProposalStatus(proposal) {
  if (proposal.cancelled) {
    return ProposalStatus.Cancelled;
  }
  if (!proposal.sponsored) {
    return ProposalStatus.Unsponsored;
  }
  if (proposal.processed && proposal.didPass) {
    return ProposalStatus.Passed;
  }
  if (proposal.processed && !proposal.didPass) {
    return ProposalStatus.Failed;
  }
  if (inVotingPeriod(proposal)) {
    return ProposalStatus.VotingPeriod;
  }
  if (inQueue(proposal)) {
    return ProposalStatus.InQueue;
  }
  if (inGracePeriod(proposal)) {
    return ProposalStatus.GracePeriod;
  }
  if (afterGracePeriod(proposal)) {
    return ProposalStatus.ReadyForProcessing;
  }
  return ProposalStatus.Unknown;
}

const tryGetDetails = details => {
  try {
    const parsedDetails = JSON.parse(details);
    if (!parsedDetails) {
      return '';
    }
    if (
      typeof parsedDetails === 'string' ||
      typeof parsedDetails === 'number'
    ) {
      return parsedDetails;
    }
    return parsedDetails;
  } catch (error) {
    return '';
  }
};

const getMinionProposalType = (proposal, details) => {
  const getUberTypeFromDetails = details => {
    // TODO - temp for bad prop
    // if (
    //   details?.uberType === 'staking'
    // ) {
    if (
      details?.uberType === 'staking' ||
      details?.uberType === PROPOSAL_TYPES.MINION_UBER_STAKE
    ) {
      return PROPOSAL_TYPES.MINION_UBER_STAKE;
    }
    if (details?.uberType === 'delegate') {
      return PROPOSAL_TYPES.MINION_UBER_DEL;
    }
    if (details?.uberType === 'ragequit') {
      return PROPOSAL_TYPES.MINION_UBER_RQ;
    }
    console.warn('Uberhaus Minion type not detected');
    console.log(details);
    return PROPOSAL_TYPES.MINION_UBER_DEFAULT;
  };
  const getUberTypeFromGraphData = proposal => {
    if (proposal?.minion?.minionType === MINION_TYPES.VANILLA) {
      return PROPOSAL_TYPES.MINION_VANILLA;
    }
    if (proposal?.minion?.minionType === MINION_TYPES.SUPERFLUID) {
      return PROPOSAL_TYPES.MINION_SUPERFLUID;
    }
    console.error('Minion type not detected');
    return PROPOSAL_TYPES.MINION_DEFAULT;
  };

  if (proposal?.minion?.minionType === MINION_TYPES.UBER) {
    return getUberTypeFromDetails(details);
  }
  return getUberTypeFromGraphData(proposal);
};

export const determineProposalType = proposal => {
  // can return a wide array of data types and structures. Be very defensive when dealing with
  // anything returned from tryGetDetails.
  const parsedDetails = tryGetDetails(proposal.details);

  if (proposal.newMember) {
    return PROPOSAL_TYPES.MEMBER;
  }
  if (proposal.whitelist) {
    return PROPOSAL_TYPES.WHITELIST;
  }
  if (proposal.guildkick) {
    return PROPOSAL_TYPES.GUILDKICK;
  }
  if (parsedDetails?.isTransmutation) {
    return PROPOSAL_TYPES.TRANSMUTATION;
  }
  if (proposal.trade) {
    return PROPOSAL_TYPES.TRADE;
  }
  if (proposal.isMinion) {
    return getMinionProposalType(proposal, parsedDetails);
  }
  return PROPOSAL_TYPES.FUNDING;
};

export const titleMaker = proposal => {
  const details = proposal.details.split('~');
  if (details[0] === 'id') {
    return details[3];
  }
  if (details[0][0] === '{') {
    let parsedDetails;

    try {
      parsedDetails = IsJsonString(proposal.details)
        ? JSON.parse(proposal.details.replace(/(\r\n|\n|\r)/gm, ''))
        : '';
      return parsedDetails.title || 'Whoops! Could not parse JSON data';
    } catch {
      console.log("Couldn't parse JSON from metadata");
      return 'Proposal';
    }
  } else {
    return proposal.details ? proposal.details : 'Proposal';
  }
};
export const hashMaker = proposal => {
  try {
    const parsed =
      IsJsonString(proposal.details) && JSON.parse(proposal.details);
    return parsed.hash || '';
  } catch (e) {
    return '';
  }
};

export const descriptionMaker = proposal => {
  try {
    const parsed = IsJsonString(proposal.details)
      ? JSON.parse(proposal.details.replace(/(\r\n|\n|\r)/gm, ''))
      : '';
    return parsed.description || '';
  } catch (e) {
    return '';
  }
};

export const linkMaker = proposal => {
  try {
    const parsed =
      IsJsonString(proposal.details) && JSON.parse(proposal.details);
    return parsed.link || '';
  } catch (e) {
    return '';
  }
};

export const determineUnreadActivityFeed = proposal => {
  const abortedOrCancelled = proposal.aborted || proposal.cancelled;
  const now = new Date() / 1000 || 0;
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
  const now = new Date() / 1000 || 0;
  const inVotingPeriod =
    now >= +proposal.votingPeriodStarts && now <= +proposal.votingPeriodEnds;

  let memberVoted = false;
  if (memberAddress) {
    memberVoted = proposal.votes.some(
      vote => vote.memberAddress.toLowerCase() === memberAddress.toLowerCase(),
    );
  }
  const needsMemberVote =
    proposal.sponsored && activeMember && inVotingPeriod && !memberVoted;

  const needsProcessing =
    proposal.sponsored &&
    now >= +proposal.gracePeriodEnds &&
    !proposal.processed;

  const twoWeeksAgo = (new Date() / 1000 || 0) - 1.21e6;
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
        <>
          <Box textTransform='uppercase' fontSize='0.8em' fontWeight={700}>
            Voting Begins {timeToNow(proposal.votingPeriodStarts)}
          </Box>
        </>
      );
    case ProposalStatus.VotingPeriod:
      return (
        <>
          <Box textTransform='uppercase' fontSize='0.8em' fontWeight={700}>
            Voting Ends {timeToNow(proposal.votingPeriodEnds)}
          </Box>
        </>
      );
    case ProposalStatus.GracePeriodEnds:
      return (
        <>
          <Box textTransform='uppercase' fontSize='0.8em' fontWeight={700}>
            <Box as='span' fontWeight={900}>
              Grace Period Ends {timeToNow(proposal.gracePeriodEnds)}
            </Box>
          </Box>
        </>
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
      return <></>;
  }
}

export const getProposalCardDetailStatus = (proposal, status) => {
  switch (status) {
    case ProposalStatus.InQueue:
      return `Voting Begins ${formatDistanceToNow(
        new Date(+proposal?.votingPeriodStarts * 1000),
        {
          addSuffix: true,
        },
      )}`;
    case ProposalStatus.VotingPeriod:
      return `Ends ${formatDistanceToNow(
        new Date(+proposal?.votingPeriodEnds * 1000),
        {
          addSuffix: true,
        },
      )}`;
    case ProposalStatus.GracePeriod:
      return `Ends ${formatDistanceToNow(
        new Date(+proposal?.gracePeriodEnds * 1000),
        {
          addSuffix: true,
        },
      )}`;
    case ProposalStatus.Failed:
    case ProposalStatus.Passed:
    case ProposalStatus.ReadyForProcessing:
      return formatDistanceToNow(new Date(+proposal?.gracePeriodEnds * 1000), {
        addSuffix: true,
      });
    default:
      return <></>;
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
      return '--';
  }
};

// return boolean as to whether user voted on a given proposal
export const memberVote = (proposal, userAddress) => {
  const vote = proposal
    ? proposal?.votes?.find(
        vote => vote.memberAddress === userAddress?.toLowerCase(),
      )
    : null;
  return vote ? vote.uintVote : null;
};

export const handleListFilter = (proposals, filter, daoMember) => {
  const updatedProposals = proposals.map(proposal => ({
    ...proposal,
    status: determineProposalStatus(proposal),
  }));
  if (filter.value === 'All') {
    return updatedProposals;
  }
  if (filter.value === 'Action Needed' || filter.value === 'Active') {
    return updatedProposals.filter(
      proposal =>
        determineUnreadProposalList(proposal, true, daoMember?.memberAddress)
          ?.unread,
    );
  }
  return updatedProposals.filter(
    proposal => proposal[filter.type] === filter.value,
  );
};

export const handleListSort = (proposals, sort) => {
  if (sort.value === 'submissionDateAsc') {
    return proposals.sort((a, b) => +a.createdAt - +b.createdAt);
  }
  if (sort.value === 'voteCountDesc') {
    return proposals
      .sort((a, b) => b.votes.length - a.votes.length)
      .sort(a => (a.status === sort.value ? -1 : 1));
  }
  if (sort.value === 'submissionDateDesc') {
    return proposals.sort((a, b) => +b.createdAt - +a.createdAt);
  }
  console.error('Received incorrect sort data type');
  return proposals;
};

export const searchProposals = (rawAddress, filterArr, proposals) => {
  const activeFilters = filterArr.filter(f => f.active);
  const address = rawAddress.toLowerCase();
  return proposals.filter(proposal =>
    activeFilters.some(
      filter => proposal[filter.value] === address && proposal,
    ),
  );
};

export const pendingUberHausStakingProposalChildDao = prop => {
  return (
    prop.proposalType === PROPOSAL_TYPES.MINION_UBER_STAKE &&
    !prop.cancelled &&
    !prop.uberHausMinionExecuted
  );
};

export const pendingUberHausStakingProposal = (prop, minionAddress) => {
  return (
    prop.applicant === minionAddress &&
    prop.proposalType === 'Member Proposal' &&
    !prop.cancelled &&
    !prop.processed
  );
};
