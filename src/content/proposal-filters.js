export const getFilterOptions = (isMember) => {
  const options = [
    {
      name: 'All',
      value: 'All',
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

  if (isMember) {
    options.unshift({
      name: 'Action Needed',
      value: 'Action Needed',
    });
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
    value: 'GracePeriod',
  },
  {
    name: 'Grace Period',
    value: 'gracePeriod',
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
