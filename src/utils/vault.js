export const vaultType = () => {
  //
};

export const vaultTypeDisplayName = {
  treasury: 'Treasury',
  'vanilla minion': 'Minion',
  minionSafe: 'Minion Safe',
  'rarible minion': 'Boost Minion',
  'nifty minion': 'Boost Minion',
};

export const vaultUrlPart = vault => {
  return vault.type === 'treasury' ? `treasury` : `minion/${vault.address}`;
};

export const vaultFilterOptions = [
  {
    name: 'All Vaults',
    value: 'all',
  },
  {
    name: 'Treasury',
    value: 'treasury',
  },
  {
    name: 'Minion',
    value: 'minion',
  },
  {
    name: 'Boost Minion',
    value: 'boostMinion',
    valueMatches: ['raribleMinion', 'nftInkMinion'],
  },
];
