import { isObjectEmpty } from './general';
import { MINION_TYPES } from './proposalUtils';
import { BOOSTS } from '../data/boosts';

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
  const lists = [
    {
      name: 'Boosts',
      id: 'boost',
      types: isObjectEmpty(daoMetaData?.boosts || {})
        ? []
        : Object.keys(daoMetaData?.boosts)
            .filter(boost => boost !== MINION_TYPES.VANILLA)
            .map(id => BOOSTS[id]),
    },
    {
      name: 'Minions',
      id: 'minion',
      types:
        daoOverview?.minions.map(minion => ({
          title: minion.details,
          description: minion.minionType,
        })) || [],
    },
  ];

  return dev ? [devBoostList, ...lists] : lists;
};
