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
  UBERHAUS_RAGEQUIT: {
    // customValidations: ['canRagequit', 'rageQuitMinimum', 'rageQuitMax'],
    id: 'UBERHAUS_RAGEQUIT',
    title: 'RageQuit',
    description: 'Submit a proposal to RageQuit from UberHaus.',
    type: PROPOSAL_TYPES.MINION_UBER_RQ,
    tx: TX.UBERHAUS_RAGEQUIT,
    required: ['shares', 'loot'],
    fields: [
      [FIELD.UBERHAUS_RAGE_QUIT_INPUT],
      [
        {
          ...FIELD.UBERHAUS_RAGE_QUIT_INPUT,
          label: 'Loot to Rage',
          htmlFor: 'loot',
          name: 'loot',
        },
      ],
    ],
  },
  UBERHAUS_WITHDRAW: {
    id: 'UBERHAUS_WITHDRAW',
    title: 'Withdraw',
    description: 'Withdraw tokens into the minion',
    type: PROPOSAL_TYPES.MINION_UBER_DEFAULT,
    tx: TX.UBERHAUS_WITHDRAW,
    required: ['withdraw'],
    fields: [[FIELD.UBERHAUS_WITHDRAW_INPUT]],
  },
  UBERHAUS_PULL: {
    id: 'UBERHAUS_PULL',
    title: 'Pull',
    description: 'Transfer funds from minion to your DAO',
    type: PROPOSAL_TYPES.MINION_UBER_DEFAULT,
    tx: TX.UBERHAUS_PULL,
    required: ['pull'],
    fields: [[FIELD.UBERHAUS_PULL_INPUT]],
  },
};
