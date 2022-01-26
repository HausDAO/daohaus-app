import { CONTRACTS } from './contracts';

export const SAFE_MINION_TX = {
  SUMMON_MINION_AND_SAFE: {
    contract: CONTRACTS.SAFE_MINION_FACTORY,
    name: 'summonMinionAndSafe',
    poll: 'subgraph',
    display: 'Summoning Minion',
    errMsg: 'Error Summoning Minion',
    successMsg: 'Minion Summoned!',
    gatherArgs: [
      '.contextData.daoid',
      '.values.minionName',
      '.values.minQuorum || 0',
      '.values.saltNonce',
    ],
  },
  SUMMON_MINION_SAFE: {
    contract: CONTRACTS.SAFE_MINION_FACTORY,
    name: 'summonMinion',
    poll: 'subgraph',
    display: 'Summoning Minion',
    errMsg: 'Error Summoning Minion',
    successMsg: 'Minion Summoned!',
    gatherArgs: [
      '.contextData.daoid',
      '.values.safeAddress',
      '.values.minionName',
      '.values.minQuorum || 0',
      '.values.saltNonce',
    ],
  },
  GENERIC_SAFE_MULTICALL: {
    contract: CONTRACTS.SELECTED_MINION_SAFE,
    name: 'proposeAction',
    poll: 'subgraph',
    display: 'Submitting Safe Minion Proposal',
    errMsg: 'Error Submitting Safe Proposal',
    successMsg: 'Safe Minion Proposal Submitted!',
    argsFromCallback: 'multiActionSafe',
  },
};
