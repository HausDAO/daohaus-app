// TODO: just playing with this sor far - for real legos these should power some factory components to build the page
// the legos to build out nft card actions are a better pattern right now.
export const VAULT = {
  TREASURY: {
    typeDisplay: 'Treasury',
    canHoldNft: false,
    balanceListTitle: 'Whitelisted Token Balances',
  },
  MINION: {
    typeDisplay: 'Minion',
    canHoldNft: true,
    balanceListTitle: 'ERC20 Token Balances',
    badge: {
      badgeColor: 'orange',
      badgeTextColor: 'white',
      badgeName: 'NIFTY',
    },
  },
  NIFTY_MINION: {
    typeDisplay: 'Minion',
    canHoldNft: true,
    badge: {
      badgeColor: 'white',
      badgeTextColor: 'black',
      badgeName: 'Vanilla',
    },
  },
};

export const vaultConfigByType = {
  treasury: VAULT.TREASURY,
  'vanilla minion': VAULT.MINION,
  'Neapolitan minion': VAULT.MINION,
  'nifty minion': VAULT.NIFTY_MINION,
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
    valueMatches: ['vanilla minion', 'nifty minion', 'Neapolitan minion'],
  },
];
