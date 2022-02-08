import { MINION_TYPES, PROPOSAL_TYPES } from '../../utils/proposalUtils';
import { FIELD } from '../fields';
import { TX } from '../txLegos/contractTX';

export const NIFTY_INK_FORMS = {
  BUY_NIFTY_INK: {
    id: 'BUY_NIFTY_INK',
    title: 'Buy a NiftyInk',
    description: 'Make a proposal to buy an NFT for the Nifty Minion vault',
    type: PROPOSAL_TYPES.BUY_NIFTY_INK,
    minionType: MINION_TYPES.NIFTY,
    tx: TX.MINION_BUY_NIFTY_INK,
    required: ['selectedMinion', 'targetInk', 'paymentRequested'],
    fields: [
      [FIELD.NIFTY_INK_URL],
      [FIELD.MINION_SELECT, FIELD.NIFTY_MINION_PAYMENT_REQUEST],
    ],
  },
};
