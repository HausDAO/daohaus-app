export const actionNeededFilter = {
  name: 'Action Needed',
  value: 'Action Needed',
  type: 'Action Needed',
};
export const activeFilter = {
  name: 'Active',
  value: 'Active',
  type: 'Active',
};
export const allFilter = {
  name: 'All',
  value: 'All',
  type: 'All',
};

export const defaultFilterOptions = {
  main: [allFilter],
  'Proposal Type': [
    {
      name: 'Funding Proposals',
      value: 'Funding Proposal',
      type: 'proposalType',
    },
    {
      name: 'Member Proposals',
      value: 'Member Proposal',
      type: 'proposalType',
    },
    {
      name: 'Whitelist Token Proposals',
      value: 'Whitelist Token Proposal',
      type: 'proposalType',
    },
    {
      name: 'Trade Proposals',
      value: 'Trade Proposal',
      type: 'proposalType',
    },
    {
      name: 'Guildkick Proposals',
      value: 'Guildkick Proposal',
      type: 'proposalType',
    },
    {
      name: 'Minion Proposals',
      value: 'Minion Proposal',
      type: 'proposalType',
    },
  ],
  'Proposal Status': [
    {
      name: 'Unsponsored',
      value: 'Unsponsored',
      type: 'status',
    },
    {
      name: 'In Queue',
      value: 'InQueue',
      type: 'status',
    },
    {
      name: 'Voting Period',
      value: 'VotingPeriod',
      type: 'status',
    },
    {
      name: 'Grace Period',
      value: 'GracePeriod',
      type: 'status',
    },
    {
      name: 'Ready For Processing',
      value: 'ReadyForProcessing',
      type: 'status',
    },
    {
      name: 'Passed',
      value: 'Passed',
      type: 'status',
    },
    {
      name: 'Failed',
      value: 'Failed',
      type: 'status',
    },
    {
      name: 'Cancelled',
      value: 'Cancelled',
      type: 'status',
    },
  ],
};

export const getFilters = (daoMember, unread) => {
  if (+daoMember?.shares && unread?.length) {
    return {
      ...defaultFilterOptions,
      main: [actionNeededFilter, allFilter],
    };
  }
  if (!+daoMember?.shares && unread?.length) {
    return {
      ...defaultFilterOptions,
      main: [activeFilter, allFilter],
    };
  }
  return defaultFilterOptions;
};

export const sortOptions = {
  main: [
    { name: 'Newest', value: 'submissionDateDesc' },
    { name: 'Oldest', value: 'submissionDateAsc' },
    { name: 'Most Votes', value: 'voteCountDesc' },
  ],
};
