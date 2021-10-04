import { BOOSTS } from '../data/boosts';
import { MINIONS } from '../data/minions';
import { handleExtractBoosts } from './metadata';

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
  const daoBoosts = handleExtractBoosts({ daoMetaData });

  const lists = [
    {
      name: 'Boosts',
      id: 'boosts',
      types: daoBoosts,
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
