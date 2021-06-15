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
