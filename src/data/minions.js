import { MINION_TYPES } from '../utils/proposalUtils';

import { FORM } from './forms';

export const MINION_NETWORKS = {
  [MINION_TYPES.VANILLA]: 'all',
  [MINION_TYPES.NIFTY]: {
    '0x64': '0xA6B75C3EBfA5a5F801F634812ABCb6Fd7055fd6d',
  },
  [MINION_TYPES.UBER]: {
    '0x2a': '0x03042577463E3820F9cA6Ca3906BAad599ba9382',
    '0x64': '0xf5106077892992B84c33C35CA8763895eb80B298',
  },
  [MINION_TYPES.SUPERFLUID]: {
    '0x64': '0xfC86DfDd3b2e560729c78b51dF200384cfe87438',
    '0x89': '0x52acf023d38A31f7e7bC92cCe5E68d36cC9752d6',
    '0x4': '0x4b168c1a1E729F4c8e3ae81d09F02d350fc905ca',
  },
  [MINION_TYPES.NEAPOLITAN]: {
    '0x64': '0x4b168c1a1E729F4c8e3ae81d09F02d350fc905ca',
  },
  [MINION_TYPES.RARIBLE]: null,
};

export const MINION_CONTENT = {
  [MINION_TYPES.VANILLA]: {
    header: 'Vanilla Minion',
    info: [
      "Vanilla minions may be boring, but that doesn't make them any less dangerous",
      'If left unchecked, these foul, conniving, hive-minded beasts will coordinate to bring the end of times.',
    ],
    publisher: 'DAOhaus',
    //  MINION_NETWORKS[MINION_TYPES.VANILLA],
  },
  [MINION_TYPES.NIFTY]: {
    header: 'Nifty Minion',
    info: [
      'Deep in warped voids of Microsoft Paint Hell, the nifty minion awaits its arrival to enslave the world with weird NFTs',
      'Travel to the desolate cesspool of xDAI to experience the true terror of insanity.',
    ],
    publisher: 'DAOhaus',
    //  MINION_NETWORKS[MINION_TYPES.NIFTY],
  },
  [MINION_TYPES.UBER]: {
    header: 'Uberhaus Minion',
    info: [
      'Uberhaus is legion. Uberhaus is many. Uberhaus is a million-legged beast built from a hive of smaller beasts.',
      "Uberhaus won't rest until the civilization is overrun with foul, disgusting creatures",
    ],
    publisher: 'DAOhaus',
    //  MINION_NETWORKS[MINION_TYPES.UBER],
  },
  [MINION_TYPES.SUPERFLUID]: {
    header: 'Superfluid Minion',
    info: [
      'Perhaps most insidious is the Superfluid Minion. This creature tempts the hearts of man with mind-numbing convenience',
      "The Superfluid minion opens a portal to Hell, and allows them to stream riches to anywhere in the world. The cost? Only the summoner's eternal soul.",
    ],
    publisher: 'DAOhaus',
    //  MINION_NETWORKS[MINION_TYPES.SUPERFLUID],
  },
  [MINION_TYPES.NEAPOLITAN]: {
    header: 'Neapolitan Minion',
    info: [
      'The Neapolitan Minion is anywhere and everywhere. It can morph into anything, then change shape.',
      "It could be in the room with you right now, and you wouldn't even know. It could even be you.",
    ],
    //  MINION_NETWORKS[MINION_TYPES.NEAPOLITAN],
  },
  // [MINION_TYPES.RARIBLE]: {
  //   header: 'Rarible Minion',
  //   info: [],
  //    { '0x1': true, '0x4': true },
  // },
};

export const SUMMON_DATA = {
  [MINION_TYPES.VANILLA]: {
    content: MINION_CONTENT[MINION_TYPES.VANILLA],
    networks: MINION_NETWORKS[MINION_TYPES.VANILLA],
    summonForm: FORM.NEW_VANILLA_MINION,
  },
  [MINION_TYPES.NIFTY]: {
    content: MINION_CONTENT[MINION_TYPES.NIFTY],
    networks: MINION_NETWORKS[MINION_TYPES.NIFTY],
    summonForm: FORM.NEW_NIFTY_MINION,
  },
  [MINION_TYPES.UBER]: {
    content: MINION_CONTENT[MINION_TYPES.UBER],
    networks: MINION_NETWORKS[MINION_TYPES.UBER],
    summonForm: null,
    // summonForm: FORM.NEW_UBER_MINION,
  },
  [MINION_TYPES.SUPERFLUID]: {
    content: MINION_CONTENT[MINION_TYPES.SUPERFLUID],
    networks: MINION_NETWORKS[MINION_TYPES.SUPERFLUID],
    summonForm: null,
    // summonForm: FORM.NEW_NIFTY_MINION,
  },
  [MINION_TYPES.NEAPOLITAN]: {
    content: MINION_CONTENT[MINION_TYPES.NEAPOLITAN],
    networks: MINION_NETWORKS[MINION_TYPES.NEAPOLITAN],
    summonForm: FORM.NEW_NEAPOLITAN_MINION,
    // summonForm: FORM.NEW_NIFTY_MINION,
  },
  // [MINION_TYPES.RARIBLE]: {
  //   content: MINION_CONTENT[MINION_TYPES.VANILLA],
  //   networks: MINION_NETWORKS[MINION_TYPES.VANILLA],
  //   summonForm: null,
  // },
};
