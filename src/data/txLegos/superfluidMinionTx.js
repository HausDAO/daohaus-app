import { CONTRACTS } from '../contracts';
import { ACTIONS } from '../onTxHashActions';
import { DETAILS } from '../details';

export const SUPERFLUID_MINION_TX = {
  SUMMON_MINION_SUPERFLUID: {
    contract: CONTRACTS.SUPERFLUID_MINION_FACTORY,
    name: 'summonMinion',
    poll: 'subgraph',
    display: 'Summoning Minion',
    errMsg: 'Error Summoning Minion',
    successMsg: 'Minion Summoned!',
    gatherArgs: [
      '.contextData.daoid',
      '.contextData.chainConfig.superfluid.superapp_addr.v1',
      '.values.minionName',
    ],
  },
  SUPERFLUID_MINION_EXECUTE: {
    contract: CONTRACTS.SUPERFLUID_MINION_LOCAL,
    name: 'executeAction',
    specialPoll: 'executeAction',
    onTxHash: ACTIONS.GENERIC_MODAL,
    display: 'Executing Minion Proposal',
    errMsg: 'Error Executing Minion Proposal',
    successMsg: 'Minion Proposal Executed!',
  },
  SUPERFLUID_STREAM: {
    contract: CONTRACTS.SUPERFLUID_MINION_SELECT,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Submitting Stream Proposal',
    errMsg: 'Error Submitting Proposals',
    successMsg: 'Proposal Submitted',
    gatherArgs: [
      '.values.applicant',
      '.values.paymentToken',
      '.values.weiRatePerSec',
      '.values.paymentRequested',
      '0x0',
      {
        type: 'detailsToJSON',
        gatherFields: DETAILS.STANDARD_PROPOSAL,
      },
    ],
  },
};
