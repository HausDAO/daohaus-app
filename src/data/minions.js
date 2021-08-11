import { MINION_TYPES } from '../utils/proposalUtils';

const MINION_CONTENT = {
  VANILLA: {
    about: 'Vanilla minion is one of the first generic ',
    publisher: 'DAOhaus',
    contentForMinion: { header: 'Already Has Minion' },
    contentForNoMinion: { header: 'Does not have Minion' },
  },
};

const NETWORKS = {
  VANILLA: {
    0x1: '0x88207Daf515e0da1A32399b3f92D128B1BF45294',
    0x4: '0x313F02A44089150C9ff7011D4e87b52404A914A9',
    0x2a: '0xCE63803E265617c55567a7A7b584fF2dbD76210B',
    0x64: '0x53508D981439Ce6A3283597a4775F6f23504d4A2',
    0x89: '0x02e458B5eEF8f23e78AefaC0F15f5d294C3762e9',
  },
};

export const SUMMON_PACK = {
  VANILLA: {
    type: 'summoner',
    minionTypeName: 'Vanilla Minion',
    ...MINION_CONTENT.VANILLA,
    availableNetworks: NETWORKS.VANILLA,
  },
};
