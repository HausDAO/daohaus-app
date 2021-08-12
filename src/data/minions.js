import { MINION_TYPES } from '../utils/proposalUtils';

export const MINION_CONTENT = {
  [MINION_TYPES.VANILLA]: {
    header: 'Vanilla Minion',
    info: [
      "Vanilla minions may be boring, but that doesn't make them any less dangerous",
      'If left unchecked, these foul, conniving, hive-minded beasts will coordinate to bring the end of times.',
    ],
    publisher: 'DAOhaus',
    networks: 'all',
  },
  [MINION_TYPES.NIFTY]: {
    header: 'Nifty Minion',
    info: [
      'Deep in warped voids of Microsoft Paint Hell, the nifty minion awaits its arrival to enslave the world with weird NFTs',
      'Travel to the desolate cesspool of xDAI to experience the true terror of insanity.',
    ],
    publisher: 'DAOhaus',
    networks: { '0x64': true },
  },
  [MINION_TYPES.UBER]: {
    header: 'Uberhaus Minion',
    info: [
      'Uberhaus is legion. Uberhaus is many. Uberhaus is a million-legged beast built from a hive of smaller beasts.',
      "Uberhaus won't rest until the civilization is overrun with foul, disgusting creatures",
    ],
    publisher: 'DAOhaus',
    networks: { '0x2a': true, '0x64': true },
  },
  [MINION_TYPES.SUPERFLUID]: {
    header: 'Superfluid Minion',
    info: [
      'Perhaps most insidious is the Superfluid Minion. This creature tempts the hearts of man with mind-numbing convenience',
      "The Superfluid minion opens a portal to Hell, and allows them to stream riches to anywhere in the world. The cost? Only the summoner's eternal soul.",
    ],
    publisher: 'DAOhaus',
    networks: { '0x64': true, '0x89': true, '0x4': true },
  },
  [MINION_TYPES.NEAPOLITAN]: {
    header: 'Neapolitan Minion',
    info: [
      'The Neapolitan Minion is anywhere and everywhere. It can morph into anything, then change shape.',
      "It could be in the room with you right now, and you wouldn't even know. It could even be you.",
    ],
    networks: { '0x64': true },
  },
};

export const SUMMON_PACK = {
  VANILLA: {
    type: 'summoner',
    minionTypeName: 'Vanilla Minion',
    content: MINION_CONTENT.VANILLA,
  },
};
