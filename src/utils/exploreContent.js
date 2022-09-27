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
    name: 'Celo',
    value: 42220,
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
  },
  {
    name: 'Grants (Accelerators)',
    value: 'Grants',
    type: 'purpose',
  },
  {
    name: 'Ventures (Investments)',
    value: 'Ventures',
    type: 'purpose',
  },
  {
    name: 'Guilds (Services)',
    value: 'Guilds',
    type: 'purpose',
  },
  {
    name: 'Clubs (Social)',
    value: 'Clubs',
    type: 'purpose',
  },
  {
    name: 'Non-profit (Impact)',
    value: 'Non-profit',
    type: 'purpose',
  },
  {
    name: 'Product (Project)',
    value: 'Products',
    type: 'purpose',
  },
  {
    name: 'Moloch V2.5',
    value: '2.2',
    type: 'version',
  },
  {
    name: 'Moloch V2.1',
    value: '2.1',
    type: 'version',
  },
  {
    name: 'Moloch V2',
    value: '2',
    type: 'version',
  },

  {
    name: 'Moloch V1',
    value: '1',
    type: 'version',
  },
  {
    name: 'More than one member',
    value: '1',
    type: 'members',
  },
];
