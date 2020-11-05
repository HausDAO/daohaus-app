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
    },
    {
      name: 'Member Proposals',
      value: 'Member Proposal',
    },
    {
      name: 'Whitelist Token Proposals',
      value: 'Whitelist Token Proposal',
    },
    {
      name: 'Trade Proposals',
      value: 'Trade Proposal',
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
    name: 'Unsponsored',
    value: 'Unsponsored',
  },
  {
    name: 'In Queue',
    value: 'InQueue',
  },
  {
    name: 'Voting Period',
    value: 'VotingPeriod',
  },
  {
    name: 'Grace Period',
    value: 'GracePeriod',
  },
  {
    name: 'Ready For Processing',
    value: 'ReadyForProcessing',
  },
  {
    name: 'Passed',
    value: 'Passed',
  },
  {
    name: 'Failed',
    value: 'Failed',
  },
  {
    name: 'Cancelled',
    value: 'Cancelled',
  },
];
