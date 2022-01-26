import { PROPOSAL_TYPES } from '../utils/proposalUtils';

export const CUSTOM_CARD_DATA = {
  [PROPOSAL_TYPES.PAYROLL]: {
    customTransferUI: 'minionTransfer',
    // execute: 'executeAction',
  },
  [PROPOSAL_TYPES.MINION_RARIBLE]: {
    execute: 'executeRarible',
  },
  [PROPOSAL_TYPES.MINION_UBER_DEL]: {
    customTransferUI: 'uberDelegate',
    execute: 'UH_delegate',
  },
  [PROPOSAL_TYPES.MINION_UBER_STAKE]: {
    customTransferUI: 'uberStake',
    execute: 'UH_staking',
  },
  [PROPOSAL_TYPES.MINION_UBER_RQ]: {
    customTransferUI: 'uberRQ',
    execute: 'executeAction',
  },
  [PROPOSAL_TYPES.WHITELIST]: {
    customTransferUI: 'whitelistToken',
  },
  [PROPOSAL_TYPES.GUILDKICK]: {
    customTransferUI: 'guildKick',
  },
  [PROPOSAL_TYPES.MULTI_TX_SAFE]: {
    customTransferUI: 'multiTx',
    execute: 'safeMinionAction',
  },
  [PROPOSAL_TYPES.BUY_NFT_RARIBLE]: {
    customTransferUI: 'raribleTransfer',
    execute: 'raribleAction',
  },
  [PROPOSAL_TYPES.SELL_NFT_RARIBLE]: {
    customTransferUI: 'raribleTransfer',
    execute: 'raribleAction',
  },
  [PROPOSAL_TYPES.MINION_BUYOUT]: {
    execute: 'minionBuyoutAction',
  },
  [PROPOSAL_TYPES.MINION_TRIBUTE]: {
    customTransferUI: 'minionTributeTransfer',
    // execute: 'raribleAction',
  },
};
