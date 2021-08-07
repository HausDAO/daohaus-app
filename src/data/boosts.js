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
    title: 'Nifty Ink',
    description:
      'MS Paint and NFTs gone mad! Buy and Sell Nifty Inks as a DAO.',
    categories: ['nft'],
  },
  SUPERFLUID: {
    id: 'SUPERFLUID',
    title: 'SuperFluid',
    description: 'Hook up the DAO to Superfluid and stream funds.',
    categories: ['defi', 'token', 'tools'],
  },
  DISCORD: {
    id: 'DISCORD',
    title: 'Discord',
    description: 'Recieve DAO proposal alerts on the DAOs Discord channel.',
    categories: ['social'],
  },
  DISCOURSE: {
    id: 'DISCOURSE',
    title: 'Discourse',
    description:
      'Palaver over DAO affairs with a DAO specific Discourse Forum.',
    categories: ['social'],
  },
  SWAPR: {
    id: 'SWAPR',
    title: 'Swapr',
    description: 'Swap, Pool, and Farm DAO Tokens using Swapr',
    categories: ['token', 'tools'],
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
    .filter(boost => boost.categories.includes(cat.id))
    .map(cat => cat.id),
}));
