import { PROPOSAL_TYPES } from '../utils/proposalUtils';
import { TX } from './contractTX';
import { FIELD } from './fields';

export const UBERHAUS_FORMS = {
  CHANGE_UBERHAUS_DELEGATE: {
    id: 'CHANGE_UBERHAUS_DELEGATE',
    title: 'Choose Champion',
    description: 'Manage your delegate to UBERhaus',
    type: PROPOSAL_TYPES.MINION_UBER_DEL,
    tx: TX.UBERHAUS_DELEGATE,
    required: ['title', 'uberHausDelegate'],
    fields: [
      [FIELD.TITLE, FIELD.DESCRIPTION, FIELD.LINK],
      [FIELD.UBERHAUS_DELEGATE],
    ],
  },
  UBERHAUS_STAKE: {
    id: 'UBERHAUS_STAKE',
    title: 'Stake in UBERhaus',
    description: "Submit your DAO's membership proposal here.",
    type: PROPOSAL_TYPES.MINION_UBER_STAKE,
    tx: TX.UBERHAUS_STAKING,
    required: ['title', 'sharesRequested', 'tributeOffered'],
    fields: [
      [FIELD.TITLE, FIELD.DESCRIPTION, FIELD.LINK],
      [FIELD.SHARES_REQUEST, FIELD.UBERHAUS_TRIBUTE],
    ],
  },
};
