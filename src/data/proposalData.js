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
    execute: 'UH_delegate',
  },
  [PROPOSAL_TYPES.MINION_UBER_STAKE]: {
    execute: 'UH_staking',
  },
};
