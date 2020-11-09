export const getFilterOptions = (isMember) => {
  const options = [
    {
      name: 'All',
      value: 'All',
    },
    {
      name: 'Action Needed',
      value: 'Action Needed',
    },
    {
      name: 'Funding Proposals',
      value: 'Funding Proposal',
      key: 'proposalType',
    },
    {
      name: 'Member Proposals',
      value: 'Member Proposal',
      key: 'proposalType',
    },
    {
      name: 'Whitelist Token Proposals',
      value: 'Whitelist Token Proposal',
      key: 'proposalType',
    },
    {
      name: 'Trade Proposals',
      value: 'Trade Proposal',
      key: 'proposalType',
    },
    {
      name: 'Guildkick Proposals',
      value: 'Guildkick Proposal',
      key: 'proposalType',
    },
    {
      name: 'Unsponsored',
      value: 'Unsponsored',
      key: 'status',
    },
    {
      name: 'In Queue',
      value: 'InQueue',
      key: 'status',
    },
    {
      name: 'Voting Period',
      value: 'VotingPeriod',
      key: 'status',
    },
    {
      name: 'Grace Period',
      value: 'GracePeriod',
      key: 'status',
    },
    {
      name: 'Ready For Processing',
      value: 'ReadyForProcessing',
      key: 'status',
    },
    {
      name: 'Passed',
      value: 'Passed',
      key: 'status',
    },
    {
      name: 'Failed',
      value: 'Failed',
      key: 'status',
    },
    {
      name: 'Cancelled',
      value: 'Cancelled',
      key: 'status',
    },
  ];

  if (!isMember) {
    options.splice(1, 1);
  }

  return options;
};

export const sortOptions = [
  {
    name: 'Newest',
    value: 'submissionDateDesc',
  },
  {
    name: 'Oldest',
    value: 'submissionDateAsc',
  },
  {
    name: 'Most Votes',
    value: 'voteCountDesc',
  },
];
