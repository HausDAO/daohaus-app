export const getDaoActivites = (daoData) => {
  const proposals = daoData.proposals.filter((prop) => !prop.cancelled);
  const votes = daoData.proposals.flatMap((prop) => {
    const votes = prop.votes.map((vote) => {
      return {
        ...vote,
        proposalType: prop.proposalType,
        proposalId: prop.proposalId,
      };
    });
    return votes;
  });
  const rageActivities = daoData.rageQuits;
  const allActivites = proposals
    .concat(votes)
    .concat(rageActivities)
    .map((activity) => {
      return {
        ...activity,
        activityData:
          activity.__typename === 'Proposal'
            ? proposalActivityData(activity)
            : voteRageActivityData(activity),
      };
    })
    .sort((a, b) => +b.activityData.createdAt - +a.activityData.createdAt);

  return allActivites;
};

const voteRageActivityData = (record) => {
  let title;
  let type;
  if (record.uintVote === 1 || record.uintVote === 0) {
    title = `voted ${record.uintVote ? 'yes' : 'no'} on ${record.proposalType}`;
    type = 'vote';
  } else {
    title = `rage quit ${record.shares} shares and ${record.loot} loot`;
    type = 'rage';
  }
  return {
    createdAt: record.createdAt,
    memberAddress: record.memberAddress,
    title,
    type,
  };
};

const proposalActivityData = (proposal) => {
  let lastActivityTime = proposal.createdAt;
  let lastActivity = 'submitted';
  let activityMember = proposal.proposer;
  let title = `submitted ${proposal.proposalType}`;
  if (proposal.sponsored) {
    lastActivityTime = proposal.sponsoredAt;
    lastActivity = 'sponsored';
    activityMember = proposal.sponsor;
    title = `sponsored ${proposal.proposalType}`;
  }
  if (proposal.processed) {
    //TODO: replace when data is available
    // return proposal.processedTime
    lastActivityTime = proposal.sponsoredAt;
    lastActivity = 'processed';
    title = `processed ${proposal.proposalType}`;
    // TODO: Add to graph
    // activityMember = proposal.processedBy;
  }
  return {
    createdAt: lastActivityTime,
    lastActivity,
    memberAddress: activityMember,
    title,
    type: 'proposal',
  };
};
