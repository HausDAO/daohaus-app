import { MINION_TYPES, PROPOSAL_TYPES } from '../../utils/proposalUtils';
import { FIELD, INFO_TEXT } from '../fields';
import { TX } from '../txLegos/contractTX';

export const SAFE_MINION_FORMS = {
  MINION_SAFE_SIMPLE: {
    id: 'MINION_SAFE_SIMPLE',
    title: 'Minion Proposal',
    description: 'Extend DAO proposals to external contracts',
    type: PROPOSAL_TYPES.MINION_DEFAULT,
    required: ['targetContract', 'title', 'selectedMinion'], // Use name key from proposal type object
    minionType: MINION_TYPES.SAFE,
    tx: TX.MINION_PROPOSE_ACTION_SAFE,
    fields: [
      [
        FIELD.TITLE,
        FIELD.MINION_SELECT,
        FIELD.TARGET_CONTRACT,
        FIELD.MINION_VALUE,
        { ...FIELD.PAYMENT_REQUEST, label: 'Forward Funds' },
        FIELD.DESCRIPTION,
      ],
      [FIELD.ABI_INPUT],
    ],
  },
  MINION_BUYOUT_TOKEN: {
    id: 'MINION_BUYOUT_TOKEN',
    title: 'Buyout Proposal',
    description: 'Request funds as buyout',
    type: PROPOSAL_TYPES.MINION_BUYOUT,
    minionType: MINION_TYPES.SAFE,
    tx: TX.SET_BUYOUT_TOKEN,
    required: ['selectedMinion', 'title', 'paymentRequested'],
    fields: [
      [
        { ...FIELD.MINION_SELECT, info: INFO_TEXT.BUYOUT_MINION },
        FIELD.TITLE,
        FIELD.DESCRIPTION,
        FIELD.LINK,
      ],
      [FIELD.BUYOUT_PAYMENT_REQUEST],
    ],
  },
  NEW_SAFE_MINION: {
    formConditions: ['easy', 'advanced'],
    tx: {
      type: 'formCondition',
      easy: TX.SUMMON_MINION_AND_SAFE,
      advanced: TX.SUMMON_MINION_SAFE,
    },
    // required: { // TODO: how to do required input validation dinamically
    //   type: 'formCondition',
    //   easy: ['minionName', 'minQuorum', 'saltNonce'],
    //   advanced: ['minionName', 'safeAddress', 'minQuorum', 'saltNonce'],
    // },
    required: ['minionName', 'minQuorum', 'saltNonce', 'safeAddress'],
    //  Solution above. The required list will check these items. If they are
    //  rendered, it will check to see if the have existing values.
    //  if they aren't rendered, validation simply skips them.
    fields: [
      [
        FIELD.SUMMON_MODE_SWITCH,
        FIELD.MINION_NAME,
        {
          type: 'formCondition',
          easy: null,
          advanced: FIELD.ONLY_SAFE,
        },
        FIELD.MINION_QUORUM,
        FIELD.SALT_NONCE,
      ],
    ],
  },
  NEW_SAFE_MINION_ADVANCED: {
    customValidations: ['noExistingSafeMinion'],
    required: ['minionName', 'safeAddress', 'minQuorum', 'saltNonce'],
    tx: TX.SUMMON_MINION_SAFE,
    fields: [
      [
        FIELD.MINION_NAME,
        FIELD.ONLY_SAFE,
        FIELD.MINION_QUORUM,
        FIELD.SALT_NONCE,
      ],
    ],
    warningMsg:
      'WARNING: you MUST add the new minion as a Safe module after deployment',
  },
  START_SAFE_MULTI: {
    id: 'START_SAFE_MULTI',
    title: 'Safe Minion Transaction Builder',
    description: 'Create a multi-transaction proposal',
    type: PROPOSAL_TYPES.MINION_SAFE,
    minionType: MINION_TYPES.SAFE,
    required: ['title'],
    fields: [
      [FIELD.TITLE, FIELD.DESCRIPTION],
      [
        {
          ...FIELD.PAYMENT_REQUEST,
          label: 'Forward Funds',
          info:
            'This proposal type will use funds from the Minion first, if its balance is sufficient. If you wish to use funds from the treasury instead, then enter the appropriate amount. Note: Early execution for Treasury funds is not allowed.',
        },
        FIELD.MINION_SELECT,
      ],
    ],
  },
  CREATE_TX: {
    id: 'CREATE_TX',
    isTx: true,
    required: ['targetContract', 'abiInput'],
    fields: [
      [
        FIELD.TARGET_CONTRACT,
        {
          ...FIELD.ABI_INPUT,
          listenTo: 'targetContract',
          hideHex: true,
        },
        FIELD.MINION_VALUE,
      ],
      [],
    ],
  },
  MULTICALL_CONFIRMATION: {
    id: 'MULTICALL_CONFIRMATION',
    fields: [[], []],
  },
};
