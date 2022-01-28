import { MINION_TYPES, PROPOSAL_TYPES } from '../../utils/proposalUtils';
import { FIELD } from '../fields';
import { TX } from '../txLegos/contractTX';

export const NIFTY_MINION_FORMS = {
  NEW_NIFTY_MINION: {
    required: ['minQuorum', 'minionName'],
    tx: TX.SUMMON_MINION_NIFTY,
    fields: [[FIELD.MINION_NAME, FIELD.MINION_QUORUM]],
  },

  MINION_NIFTY: {
    id: 'MINION_NIFTY',
    title: 'Minion Proposal',
    description: 'Extend DAO proposals to external contracts',
    type: PROPOSAL_TYPES.MINION_DEFAULT,
    required: ['targetContract', 'title', 'selectedMinion'], // Use name key from proposal type object
    minionType: MINION_TYPES.NIFTY,
    tx: TX.MINION_PROPOSE_ACTION_NIFTY,
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

  PAYROLL_NIFTY: {
    id: 'PAYROLL_NIFTY',
    title: 'Payroll Proposal',
    logValues: true,
    description: 'Pay Members with a minion',
    type: PROPOSAL_TYPES.PAYROLL,
    required: ['title', 'selectedMinion', 'minionPayment', 'applicant'],
    minionType: MINION_TYPES.NIFTY,
    tx: TX.PAYROLL_NIFTY,
    fields: [
      [FIELD.TITLE, FIELD.MINION_SELECT, FIELD.MINION_PAYMENT, FIELD.APPLICANT],
    ],
    additionalOptions: [FIELD.DESCRIPTION],
  },
};
