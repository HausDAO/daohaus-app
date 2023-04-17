export const SORT_OPTIONS = [
  {
    value: 'guildBankValue',
    name: 'Bank Value',
  },
  {
    value: 'members',
    name: 'Members',
    count: true,
  },
  {
    value: 'proposals',
    name: 'Proposals',
    count: true,
  },
  {
    value: 'summoningTime',
    name: 'Summoning Time',
  },
];

export const EXPLORE_FILTER_OPTIONS = [
  {
    name: 'Mainnet',
    value: 1,
    type: 'network',
    default: true,
  },
  {
    name: 'Arbitrum',
    value: 42161,
    type: 'network',
    default: true,
  },
  {
    name: 'xDai',
    value: 100,
    type: 'network',
    default: true,
  },
  {
    name: 'Polygon (Matic)',
    value: 137,
    type: 'network',
    default: true,
  },

  {
    name: 'Optimism',
    value: 10,
    type: 'network',
    default: true,
  },
  {
    name: 'Göerli',
    value: 5,
    type: 'network',
    default: false,
  },
  {
    name: 'Celo',
    value: 42220,
    type: 'network',
    default: false,
  },
  {
    name: 'More than one member',
    value: '1',
    type: 'members',
  },
];
