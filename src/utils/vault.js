export const vaultTypeDisplayName = {
  treasury: 'Treasury',
  minion: 'Minion',
  minionSafe: 'Minion Safe',
  raribleMinion: 'Boost Minion',
  nftInkMinion: 'Boost Minion',
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
