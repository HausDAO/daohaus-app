// TODO: just playing with this sor far - for real legos these should power some factory components to build the page
export const VAULT = {
  TREASURY: {
    typeDisplay: 'Treasury',
    canHoldNft: false,
    balanceListTitle: 'Whitelisted Token Balances',
    // try to tell it how to get token list from context?
    cardActions: ['collectTokens'],
  },
  // could profile balance list work off this?
  MINION: {
    typeDisplay: 'Minion',
    canHoldNft: true,
    balanceListTitle: 'ERC20 Token Balances',
    cardActions: [],
  },
  RARIBLE_MINION: {
    typeDisplay: 'Boost Minion',
    canHoldNft: true,
    cardActions: [],
  },
  NIFTY_MINION: {
    typeDisplay: 'Minion',
    canHoldNft: true,
    nft: {
      marketplaceContract: '0x0',
      // or marketplaceConnector maybe
      actions: ['sendErc721Action', 'sellNiftyAction'],
      // could also point at txnames?
      actionsOpt2: {
        sendErc721Action: {
          dropDownLabel: 'Send NFT',
        },
      },
    },
  },
  MINION_SAFE: {
    typeDisplay: 'Minion Safe',
    canHoldNft: true,
    canHaveInternalBalances: true,
    canHoldToken: true,
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
