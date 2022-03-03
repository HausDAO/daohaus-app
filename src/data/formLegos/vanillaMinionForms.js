import { MINION_TYPES, PROPOSAL_TYPES } from '../../utils/proposalUtils';
import { FIELD } from '../fields';
import { TX } from '../txLegos/contractTX';

export const VANILLA_MINION_FORMS = {
  NEW_VANILLA_MINION: {
    required: ['minionName'],
    minionType: MINION_TYPES.VANILLA,
    tx: TX.SUMMON_MINION_VANILLA,
    fields: [[FIELD.MINION_NAME]],
  },
  MINION: {
    id: 'MINION',
    title: 'Minion Proposal',
    description: 'Extend DAO proposals to external contracts',
    type: PROPOSAL_TYPES.MINION_DEFAULT,
    required: ['targetContract', 'title', 'selectedMinion'],
    minionType: MINION_TYPES.VANILLA,
    tx: TX.MINION_PROPOSE_ACTION,
    fields: [
      [
        FIELD.TITLE,
        FIELD.MINION_SELECT,
        FIELD.TARGET_CONTRACT,
        FIELD.MINION_VALUE,
        FIELD.DESCRIPTION,
      ],
      [FIELD.ABI_INPUT],
    ],
  },
  PAYROLL: {
    id: 'PAYROLL',
    title: 'Payroll Proposal',
    description: 'Pay Members with a minion',
    type: PROPOSAL_TYPES.PAYROLL,
    required: ['title', 'selectedMinion', 'minionPayment', 'applicant'],
    minionType: MINION_TYPES.VANILLA,
    tx: TX.PAYROLL,
    fields: [
      [FIELD.TITLE, FIELD.MINION_SELECT, FIELD.MINION_PAYMENT, FIELD.APPLICANT],
    ],
    additionalOptions: [FIELD.DESCRIPTION],
  },
};
