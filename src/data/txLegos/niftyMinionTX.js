import { CONTRACTS } from '../contracts';
import { ACTIONS } from '../onTxHashActions';
import { DETAILS } from '../details';

export const NIFTY_MINION_TX = {
  SUMMON_MINION_NIFTY: {
    contract: CONTRACTS.NIFTY_MINION_FACTORY,
    name: 'summonMinion',
    poll: 'subgraph',
    display: 'Summoning Minion',
    errMsg: 'Error Summoning Minion',
    successMsg: 'Minion Summoned!',
    gatherArgs: [
      '.contextData.daoid',
      '.values.minionName',
      '.values.minQuorum',
    ],
  },
  PAYROLL_NIFTY: {
    contract: CONTRACTS.SELECTED_MINION_NIFTY,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Sending Token',
    errMsg: 'Error Submitting Proposal',
    successMsg: 'Proposal Submitted!',
    gatherArgs: [
      '.values.minionToken',
      0,
      {
        type: 'encodeHex',
        contract: CONTRACTS.ERC_20,
        fnName: 'transfer',
        gatherArgs: ['.values.applicant', '.values.minionPayment'],
      },
      {
        type: 'detailsToJSON',
        gatherFields: DETAILS.PAYROLL_PROPOSAL,
      },
      '.contextData.daoOverview.depositToken.tokenAddress',
      0,
    ],
  },
  MINION_SELL_NIFTY_NIFTY: {
    contract: CONTRACTS.LOCAL_NIFTY_MINION,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.GENERIC_MODAL,
    display: 'Sell Nifty',
    errMsg: 'Error Submitting Proposal',
    successMsg: 'Proposal Submitted!',
    gatherArgs: [
      '.localValues.contractAddress',
      0,
      {
        type: 'encodeHex',
        contract: CONTRACTS.NIFTY_INK,
        fnName: 'setTokenPrice',
        gatherArgs: ['.localValues.tokenId', '.values.price'],
      },
      {
        type: 'detailsToJSON',
        gatherFields: DETAILS.MINION_SELL_NIFTY,
      },
      '.contextData.daoOverview.depositToken.tokenAddress',
      0,
    ],
  },
  MINION_PROPOSE_ACTION_NIFTY: {
    contract: CONTRACTS.SELECTED_MINION_NIFTY,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Propose Minion Action',
    errMsg: 'Error submitting action to minion',
    successMsg: 'Minion Proposal Created!',
    argsFromCallback: 'proposeActionNifty',
    createDiscourse: true,
  },
};
