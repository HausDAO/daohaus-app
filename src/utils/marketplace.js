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
  const boostTypes = Object.entries(daoMetaData?.boosts)
    .filter(([key]) => !boostsBanList.includes(key))
    .map(([key, value]) => {
      if (BOOSTS[key]) {
        return { ...value, ...BOOSTS[key] };
      }
      const hasOldID = findByOldID(key);
      if (hasOldID) {
        return { ...value, ...hasOldID };
      }
      return { ...value, id: key };
    });

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
