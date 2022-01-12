import { PROPOSAL_TYPES } from '../utils/proposalUtils';

export const CUSTOM_CARD_DATA = {
  [PROPOSAL_TYPES.PAYROLL]: {
    customTransferUI: 'minionTransfer',
    execute: 'executeAction',
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
};
