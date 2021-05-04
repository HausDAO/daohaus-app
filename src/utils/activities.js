// ACTIVITY MODEL

// DAO ACTIVITIES: {
//   title: String
//   createdAt: Date(UTC),
//   voteBadge: String,
//   statusBadge: String,
//   rageBadge: String
//   positiveStatus: String,
//   negativeStatus: String,
//   voteStatus: String
// }

const getVotes = proposals => {
  return proposals.flatMap(prop => {
    const votes = prop.votes.map(vote => {
      return {
        ...vote,
        proposalType: prop.proposalType,
        proposalId: prop.proposalId,
      };
    });
    return votes;
  });
};

const handleVoteTitle = activity => {
  return ` voted ${+activity?.uintVote === 1 ? 'Yes' : 'No'} on ${
    activity?.proposalType
  }`;
};

const handleProposal = proposal => {
  if (proposal.processed) {
    return {
      title: `processed ${proposal.proposalType}`,
      createdAt: proposal.sponsoredAt,
      statusBadge: 'processed',
      memberAddress: proposal.processor,
      proposalId: proposal.proposalId,
      daoData: proposal.daoData,
      yesVotes: proposal.yesVotes,
      noVotes: proposal.noVotes,
    };
  }
  if (proposal.sponsored) {
    return {
      title: `sponsored ${proposal.proposalType}`,
      createdAt: proposal.sponsoredAt,
      statusBadge: 'sponsored',
      memberAddress: proposal.sponsor,
      proposalId: proposal.proposalId,
      daoData: proposal.daoData,
      yesVotes: proposal.yesVotes,
      noVotes: proposal.noVotes,
    };
  }
  return {
    title: `submitted ${proposal.proposalType}`,
    createdAt: proposal.createdAt,
    statusBadge: 'submitted',
    memberAddress: proposal.proposer,
    proposalId: proposal.proposalId,
    daoData: proposal.daoData,
    yesVotes: proposal.yesVotes,
    noVotes: proposal.noVotes,
  };
};

const handleVote = vote => {
  return {
    proposalId: vote.proposalId,
    memberAddress: vote.memberAddress,
    title: handleVoteTitle(vote),
    voteBadge: vote.uintVote,
    createdAt: vote.createdAt,
  };
};

const handleRQ = rq => ({
  memberAddress: rq.memberAddress,
  title: `quit ${rq.shares} shares and ${rq.loot} loot`,
  rageBadge: 'Rage Quit',
  createdAt: rq.createdAt,
  daoData: rq.daoData,
});

const buildProposalHistory = proposal => {
  const histories = [
    {
      title: 'Submitted',
      createdAt: proposal.createdAt,
      memberAddress: proposal.proposer,
    },
  ];

  if (proposal.cancelled || proposal.aborted) {
    histories.push({
      title: 'Cancelled',
      negativeStatus: proposal.status,
      createdAt: proposal.cancelledAt,
      memberAddress: proposal.proposer,
    });
  }

  if (proposal.sponsored) {
    histories.push({
      title: 'Sponsored',
      createdAt: proposal.sponsoredAt,
      memberAddress: proposal.sponsor,
    });
  }

  if (proposal.processed) {
    histories.push({
      title: 'Processed',
      positiveStatus: proposal.status,
      createdAt: proposal.processedAt,
      memberAddress: proposal.processor,
    });
  }

  return histories;
};

const voteHistoryData = (record, proposal) => {
  const totalVotesShares = +proposal.yesShares + +proposal.noShares;
  const memberPercentageOfVote = (
    (+record.memberPower / totalVotesShares) *
    100
  ).toFixed(2);
  const operator = record.uintVote ? '+' : '-';
  return {
    title: `voted ${+record.uintVote === 1 ? 'yes' : 'no'}`,
    uintVote: record.uintVote,
    voteStatus: `${totalVotesShares} Shares (${operator}${memberPercentageOfVote}%)`,
    createdAt: record.createdAt,
    memberAddress: record.memberAddress,
  };
};

export const getDaoActivites = daoData => {
  const proposals = daoData.proposals
    .filter(prop => !prop.cancelled)
    .map(proposal => handleProposal(proposal));

  const votes = getVotes(daoData.proposals).map(vote => handleVote(vote));
  const rageActivities = daoData.rageQuits.map(rq => handleRQ(rq));
  const allActivites = proposals
    .concat(votes)
    .concat(rageActivities)
    .sort((a, b) => +b.createdAt - +a.createdAt);
  return allActivites;
};

export const getProposalsActivites = daoData => {
  const proposals = daoData.proposals
    .filter(prop => !prop.cancelled)
    .map(proposal => handleProposal(proposal));
  const votes = getVotes(daoData.proposals).map(vote => handleVote(vote));
  const allActivites = proposals
    .concat(votes)
    .sort((a, b) => +b.createdAt - +a.createdAt);
  return allActivites;
};

export const getMembersActivites = daoData => {
  const proposals = daoData.proposals
    .filter(prop => {
      return !prop.cancelled && prop.proposalType === 'Member Proposal';
    })
    .map(proposal => handleProposal(proposal));
  const votes = getVotes(daoData.proposals)
    .filter(vote => vote.proposalType === 'Member Proposal')
    .map(vote => handleVote(vote));

  const rageActivities = daoData.rageQuits.map(rq => handleRQ(rq));
  const allActivites = proposals
    .concat(votes)
    .concat(rageActivities)
    .sort((a, b) => +b.createdAt - +a.createdAt);
  return allActivites;
};

export const getMemberActivites = memberAddress => daoData => {
  const proposals = daoData.proposals
    .filter(prop => {
      const memberRelated =
        memberAddress?.toLowerCase() === prop.proposer?.toLowerCase() ||
        memberAddress?.toLowerCase() === prop.sponser?.toLowerCase() ||
        memberAddress?.toLowerCase() === prop.memberAddress?.toLowerCase() ||
        memberAddress?.toLowerCase() === prop.applicant?.toLowerCase();
      return !prop.cancelled && memberRelated;
    })
    .map(proposal => handleProposal(proposal));

  const votes = getVotes(daoData.proposals)
    .filter(vote => {
      return (
        vote.proposalType === 'Member Proposal' &&
        memberAddress === vote.memberAddress
      );
    })
    .map(vote => handleVote(vote));

  const rageActivities = daoData.rageQuits
    .filter(rage => rage.memberAddress === memberAddress)
    .map(rq => handleRQ(rq));

  const allActivites = proposals
    .concat(votes)
    .concat(rageActivities)
    .sort((a, b) => +b.createdAt - +a.createdAt);

  return allActivites;
};

export const getProfileActivites = memberAddress => daoData => {
  const proposals = daoData.proposals
    .filter(prop => {
      const memberRelated =
        memberAddress?.toLowerCase() === prop.proposer?.toLowerCase() ||
        memberAddress?.toLowerCase() === prop.sponsor?.toLowerCase() ||
        memberAddress?.toLowerCase() === prop.memberAddress?.toLowerCase() ||
        memberAddress?.toLowerCase() === prop.applicant?.toLowerCase();
      return !prop.cancelled && memberRelated;
    })
    .map(proposal => handleProposal(proposal));

  const votes = getVotes(daoData.proposals)
    .filter(vote => memberAddress === vote.memberAddress)
    .map(vote => handleVote(vote));

  const rageActivities = daoData.rageQuits
    .filter(
      rage => rage.memberAddress.toLowerCase() === memberAddress.toLowerCase(),
    )
    .map(rq => handleRQ(rq));

  const allActivites = proposals
    .concat(votes)
    .concat(rageActivities)
    .sort((a, b) => +b.createdAt - +a.createdAt);

  return allActivites;
};

export const getProposalHistories = proposal => {
  const votes = proposal.votes.map(vote => voteHistoryData(vote, proposal));
  const proposalStates = buildProposalHistory(proposal);
  const allActivites = proposalStates
    .concat(votes)
    .sort((a, b) => +b.createdAt - +a.createdAt);
  return allActivites;
};
