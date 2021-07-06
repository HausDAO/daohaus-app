export const VAULT = {
  TREASURY: {
    typeDisplay: 'Treasury',
    canHoldNft: false,
    canHaveInternalBalances: false,
  },
  MINION: {
    typeDisplay: 'Minion',
    canHoldNft: true,
    canHaveInternalBalances: true,
    cardActions: [],
  },
  RARIBLE_MINION: {
    typeDisplay: 'Boost Minion',
    canHoldNft: true,
    canHaveInternalBalances: true,
    cardActions: [],
  },
  NIFTY_MINION: {
    typeDisplay: 'Minion',
    canHoldNft: true,
    canHaveInternalBalances: true,
    cardActions: ['sell'],
  },
  MINION_SAFE: {
    typeDisplay: 'Minion Safe',
    canHoldNft: true,
    canHaveInternalBalances: true,
    cardActions: [],
  },
};

export const vaultConfigByType = {
  treasury: VAULT.TREASURY,
  'vanilla minion': VAULT.MINION,
  minionSafe: VAULT.MINION_SAFE,
  'rarible minion': VAULT.RARIBLE_MINION,
  'nifty minion': VAULT.NIFTY_MINION,
};

// TODO: build off config
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
    value: 'vanilla minion',
  },
  {
    name: 'Boost Minion',
    value: 'boostMinion',
    valueMatches: ['rarible minion', 'nifty minion'],
  },
];
