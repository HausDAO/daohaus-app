import { PLAYLISTS } from '../utils/playlists';

export const BOOSTS = {
  VANILLA_MINION: {
    id: 'VANILLA_MINION',
    playlist: PLAYLISTS.VANILLA_MINION,
    title: 'Vanilla Minion Suite',
    description:
      'Call any contract with a DAO Proposal. One call per proposal.',
    deploySteps: [],
    categories: ['dev'],
    networks: 'all',
  },
  NIFTY_INK: {
    id: 'NIFTY_INK',
    title: 'Nifty Ink',
    description: 'Buy and Sell Niftys as a DAO with Nifty Ink!',
    categories: ['nft'],
  },
  SUPERFLUID: {
    id: 'SUPERFLUID',
    title: 'SuperFluid',
    description: 'Stream Vault funds from a DAO vault to any account.',
    categories: ['defi', 'token', 'tools'],
  },
  DISCORD: {
    id: 'DISCORD',
    title: 'Discord',
    description: 'Discord alerts for proposals',
    categories: ['social'],
  },
  DISCOURSE: {
    id: 'DISCOURSE',
    title: 'Discourse',
    description: 'Create a Discourse Forum for your DAO',
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
