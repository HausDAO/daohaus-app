import { PROPOSAL_TYPES } from '../utils/proposalUtils';

export const CUSTOM_CARD_DATA = {
  [PROPOSAL_TYPES.PAYROLL]: {
    customTransferUI: 'minionTransfer',
    // execute: 'executeAction',
  },
  [PROPOSAL_TYPES.MINION_ERC20]: {
    customTransferUI: 'minionTransfer',
  },
  [PROPOSAL_TYPES.MINION_NATIVE]: {
    customTransferUI: 'minionTransfer',
  },
  [PROPOSAL_TYPES.MINION_RARIBLE]: {
    execute: 'executeRarible',
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
  [PROPOSAL_TYPES.MINION_SAFE]: {
    customTransferUI: 'multiTx',
    execute: 'safeMinionAction',
  },
  [PROPOSAL_TYPES.DISPERSE]: {
    customTransferUI: 'disperse',
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
    execute: 'minionTributeAction',
  },
  [PROPOSAL_TYPES.MINION_SUPERFLUID]: {
    customTransferUI: 'superfluidStream',
  },
  [PROPOSAL_TYPES.SWAPR_STAKING]: {
    customTransferUI: 'tutorialTransfer',
  },
  [PROPOSAL_TYPES.POSTER_RATIFY]: {
    customTransferUI: 'ratifyContent',
  },
};
