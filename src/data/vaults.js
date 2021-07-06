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
  },
  RARIBLE_MINION: {
    typeDisplay: 'Boost Minion',
    canHoldNft: true,
    canHaveInternalBalances: true,
  },
  NIFTY_MINION: {
    typeDisplay: 'Minion',
    canHoldNft: true,
    canHaveInternalBalances: true,
  },
  MINION_SAFE: {
    typeDisplay: 'Minion Safe',
    canHoldNft: true,
    canHaveInternalBalances: true,
  },
};

export const vaultConfigByType = {
  treasury: VAULT.TREASURY,
  'vanilla minion': VAULT.MINION,
  minionSafe: VAULT.MINION_SAFE,
  'rarible minion': VAULT.RARIBLE_MINION,
  'nifty minion': VAULT.NIFTY_MINION,
};
