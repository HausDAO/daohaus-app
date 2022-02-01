import { MINION_TYPES, PROPOSAL_TYPES } from '../../utils/proposalUtils';
import { FIELD } from '../fields';
import { TX } from '../txLegos/contractTX';

export const DISPERSE_FORMS = {
  MINION_DISPERSE: {
    id: 'MINION_DISPERSE',
    dev: true,
    title: 'Disperse Tokens',
    description: 'Make a proposal to disperse tokens to a list of addresses',
    type: PROPOSAL_TYPES.DISPERSE,
    minionType: MINION_TYPES.SAFE,
    formConditions: ['token', 'eth'],
    tx: {
      type: 'formCondition',
      eth: TX.DISPERSE_ETH,
      token: TX.DISPERSE_TOKEN,
    },
    required: ['selectedMinion', 'userList', 'amountList', 'disperseTotal'],
    fields: [
      [FIELD.MINION_SELECT, FIELD.TITLE, FIELD.DESCRIPTION, FIELD.LINK],
      [
        FIELD.DISPERSE_TYPE_SWITCH,
        {
          type: 'formCondition',
          eth: null,
          token: FIELD.MINION_TOKEN_SELECT,
        },
        FIELD.DISPERSE_CSV,
      ],
    ],
  },
};
