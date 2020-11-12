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

export const getProposalsActivites = (daoData) => {
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
  const allActivites = proposals
    .concat(votes)
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

export const getMembersActivites = (daoData) => {
  const proposals = daoData.proposals.filter((prop) => {
    return !prop.cancelled && prop.proposalType === 'Member Proposal';
  });
  const votes = daoData.proposals
    .flatMap((prop) => {
      const votes = prop.votes.map((vote) => {
        return {
          ...vote,
          proposalType: prop.proposalType,
          proposalId: prop.proposalId,
        };
      });
      return votes;
    })
    .filter((vote) => vote.proposalType === 'Member Proposal');
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

export const getMemberActivites = (daoData, memberAddress) => {
  const proposals = daoData.proposals.filter((prop) => {
    const memberRelated =
      memberAddress === prop.proposer ||
      memberAddress === prop.sponser ||
      memberAddress === prop.memberAddress ||
      memberAddress === prop.applicant;
    return (
      !prop.cancelled &&
      prop.proposalType === 'Member Proposal' &&
      memberRelated
    );
  });

  const votes = daoData.proposals
    .flatMap((prop) => {
      const votes = prop.votes.map((vote) => {
        return {
          ...vote,
          proposalType: prop.proposalType,
          proposalId: prop.proposalId,
        };
      });
      return votes;
    })
    .filter((vote) => {
      return (
        vote.proposalType === 'Member Proposal' &&
        memberAddress === vote.memberAddress
      );
    });

  const rageActivities = daoData.rageQuits.filter(
    (rage) => rage.memberAddress === memberAddress,
  );
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

export const getProfileActivites = (daoData, memberAddress) => {
  const proposals = daoData.proposals.filter((prop) => {
    const memberRelated =
      memberAddress === prop.proposer ||
      memberAddress === prop.sponser ||
      memberAddress === prop.memberAddress ||
      memberAddress === prop.applicant;
    return !prop.cancelled && memberRelated;
  });

  const votes = daoData.proposals
    .flatMap((prop) => {
      const votes = prop.votes.map((vote) => {
        return {
          ...vote,
          proposalType: prop.proposalType,
          proposalId: prop.proposalId,
        };
      });
      return votes;
    })
    .filter((vote) => {
      return memberAddress === vote.memberAddress;
    });

  const rageActivities = daoData.rageQuits.filter(
    (rage) => rage.memberAddress === memberAddress,
  );
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

export const getProposalHistories = (proposal) => {
  const votes = proposal.votes.map((vote) => voteHistoryData(vote));
  const proposalStates = buildProposalHistory(proposal);

  console.log('votes', votes);

  const allActivites = proposalStates
    .concat(votes)
    .sort((a, b) => +b.activityData.createdAt - +a.activityData.createdAt);

  return allActivites;
};

const voteRageActivityData = (record) => {
  let title;
  let type;
  if (record.__typename === 'Vote') {
    title = `voted ${+record.uintVote === 1 ? 'yes' : 'no'} on ${
      record.proposalType
    }`;
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

const voteHistoryData = (record) => {
  return {
    ...record,
    activityData: {
      createdAt: record.createdAt,
      memberAddress: record.memberAddress,
    },
  };
};

const buildProposalHistory = (proposal) => {
  const histories = [
    {
      ...proposal,
      historyStep: 'Submitted',
      activityData: {
        createdAt: proposal.createdAt,
        memberAddress: proposal.memberAddress,
      },
    },
  ];

  if (proposal.cancelled || proposal.aborted) {
    histories.push({
      ...proposal,
      historyStep: 'Cancelled',
      activityData: {
        //update with cancelledAt
        createdAt: proposal.createdAt,
        memberAddress: proposal.memberAddress,
      },
    });
  }

  if (proposal.sponsored) {
    histories.push({
      ...proposal,
      historyStep: 'Sponsored',
      activityData: {
        createdAt: proposal.sponsoredAt,
        // update with sponsoredBy
        memberAddress: proposal.memberAddress,
      },
    });
  }

  if (proposal.processed) {
    histories.push({
      ...proposal,
      historyStep: 'Processed',
      activityData: {
        createdAt: proposal.sponsoredAt,
        // update with processedBy
        memberAddress: proposal.memberAddress,
      },
    });
  }

  return histories;
};
