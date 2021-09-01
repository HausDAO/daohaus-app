import { isObjectEmpty, omit } from './general';
import { MINION_TYPES } from './proposalUtils';
import { BOOSTS } from '../data/boosts';
import { MINIONS } from '../data/minions';

const boostsBanList = [
  ...Object.values(omit('VANILLA', MINION_TYPES)),
  'cco',
  'proposalTypes',
  'customTheme',
  'transmutation',
  'snapshot',
];

const findByOldID = id => {
  if (!id) return;
  return Object.values(BOOSTS).find(boost => boost.oldId === id) || null;
};

export const devBoostList = {
  name: 'DEV Boosts',
  id: 'dev',
  types: Object.values(BOOSTS).reduce((arr, boost) => {
    if (boost.dev) {
      return [...arr, boost];
    }
    return arr;
  }, []),
};

export const generateLists = (daoMetaData, daoOverview, dev) => {
  const boostTypes = Object.entries(daoMetaData?.boosts).reduce(
    (array, [key, value]) => {
      if (boostsBanList.includes(key)) return array;
      if (BOOSTS[key]) {
        return [...array, { ...value, ...BOOSTS[key] }];
      }
      const legacyBoost = findByOldID(key);
      if (legacyBoost) {
        const hasDuplicate = array.some(boost => boost.id === legacyBoost.id);
        if (!hasDuplicate) return [{ ...value, ...legacyBoost }];
        return array;
      }
      return array;
    },
    [],
  );
  console.log(boostTypes);
  const lists = [
    {
      name: 'Boosts',
      id: 'boosts',
      types: isObjectEmpty(daoMetaData?.boosts || {}) ? [] : boostTypes,
    },
    {
      name: 'Minions',
      id: 'minions',
      types:
        daoOverview?.minions.map(minion => ({
          title: minion.details,
          description: minion.minionType,
          id: minion.minionAddress,
          data: MINIONS[minion.minionType],
        })) || [],
    },
  ];
  if (dev && devBoostList.types.length) {
    return [devBoostList, ...lists];
  }
  return lists;
};

export const getSettingsLink = (settings, params) => {
  if (settings.appendToDaoPath) {
    return `/dao/${params.daochain}/${params.daoid}/${settings.appendToDaoPath}`;
  }
};
