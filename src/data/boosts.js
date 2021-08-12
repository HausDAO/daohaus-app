import { PLAYLISTS } from '../utils/playlists';

export const BOOSTS = {
  DEV_SUITE: {
    id: 'DEV_SUITE',
    playlist: PLAYLISTS.VANILLA_MINION,
    title: 'Nerd Rage Dev Suite',
    description: 'Unlock a suite of generic, customizable minion proposals. ',
    deploySteps: [],
    categories: ['dev'],
    networks: 'all',
  },
  NIFTY_INK: {
    id: 'NIFTY_INK',
    oldId: 'niftyInk',
    title: 'Nifty Ink',
    description: 'The Niftiest Inks in all Hell.',
    categories: ['nft'],
  },
  DISCORD: {
    id: 'DISCORD',
    oldId: 'notificationsLevel1',
    title: 'Discord Notifications',
    description: `You're basically rugproof with this`,
    categories: ['social'],
  },
  MINT_GATE: {
    id: 'MINT_GATE',
    oldId: 'mintGate',
    title: 'Mint Gate',
    description: 'Gatin those mints since 1975, baby!',
    categories: ['nft', 'tools'],
  },
  SUPERFLUID: {
    id: 'SUPERFLUID',
    oldId: 'superfluid',
    title: 'SuperFluid',
    description: 'Hook up the DAO to Superfluid and stream funds.',
    categories: ['defi', 'token', 'tools'],
  },

  DISCOURSE: {
    id: 'DISCOURSE',
    oldId: 'discourse',
    title: 'Discourse',
    description: 'Brood over these deep, eternal mysteries of the DAO.',
    categories: ['social'],
  },
  SWAPR: {
    id: 'SWAPR',
    title: 'Swapr',
    description: 'Swap, Pool, and Farm DAO Tokens using Swapr',
    categories: ['token', 'tools'],
  },
  BOOSTY_BOOST: {
    id: 'BOOSTY_BOOST',
    dev: true,
    title: 'Unregistered Boost',
    description: "Just Didn't register it.",
    categories: ['dev'],
  },
};

export const allBoosts = {
  name: 'Boosts',
  id: 'all',
  boosts: Object.values(BOOSTS).map(boost => boost.id),
};
const categoryStarter = [
  { name: 'NFT', id: 'nft' },
  { name: 'DAO Dev', id: 'dev' },
  { name: 'Community', id: 'social' },
  { name: 'Tools', id: 'tools' },
  { name: 'Token', id: 'token' },
];
export const categories = categoryStarter.map(cat => ({
  ...cat,
  boosts: Object.values(BOOSTS)
    .filter(boost => boost.categories.includes(cat.id) && !boost.dev)
    .map(cat => cat.id),
}));
