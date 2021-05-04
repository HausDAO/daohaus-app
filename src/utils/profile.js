import { tallyUSDs } from './tokenValue';

export const calcValue = (member, daoTokens, overview) => {
  if (daoTokens && member && overview) {
    const { loot, shares } = member;
    const { totalShares, totalLoot } = overview;
    const totalDaoVal = tallyUSDs(daoTokens);
    const memberProportion =
      (+shares + +loot) / (+totalShares + +totalLoot) || 0;

    const result = memberProportion * totalDaoVal;

    return result.toFixed(2);
  }
  return 0;
};

export const calcPower = (member, overview) => {
  if (member?.shares && overview?.totalShares) {
    const total = (member.shares / overview.totalShares) * 100;
    return total.toFixed(1);
  }
  return 0;
};
