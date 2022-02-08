import { MINION_TYPES, PROPOSAL_TYPES } from '../../utils/proposalUtils';
import { FIELD } from '../fields';
import { TX } from '../txLegos/contractTX';

const SUB_FORMS = {
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

export const MULTI_FORMS = {
  SAFE_TX_BUILDER: {
    id: 'SAFE_TX_BUILDER',
    logValues: true,
    isTxBuilder: true,
    type: 'multiForm',
    minionType: MINION_TYPES.SAFE,
    tx: TX.GENERIC_SAFE_MULTICALL,
    title: 'Safe Minion TX Builder',
    description: 'Create a multi-transaction proposal',
    footer: 'end',
    collapse: 'all',
    customWidth: `900px`,
    forms: [
      SUB_FORMS.START_SAFE_MULTI,
      SUB_FORMS.CREATE_TX,
      SUB_FORMS.MULTICALL_CONFIRMATION,
    ],
  },
};
