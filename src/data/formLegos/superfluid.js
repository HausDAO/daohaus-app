import { MINION_TYPES, PROPOSAL_TYPES } from '../../utils/proposalUtils';
import { FIELD } from '../fields';
import { TX } from '../txLegos/contractTX';

export const SUPERFLUID_MINION = {
  NEW_SUPERFLUID_MINION: {
    required: ['minionName'],
    minionType: MINION_TYPES.SUPERFLUID,
    tx: TX.SUMMON_MINION_SUPERFLUID,
    fields: [[FIELD.MINION_NAME]],
  },
  SUPERFLUID_STREAM: {
    id: 'SUPERFLUID_STREAM',
    title: 'Superfluid Payment Stream',
    description: 'Stream funds from the Superfluid Minion',
    type: PROPOSAL_TYPES.MINION_SUPERFLUID,
    minionType: MINION_TYPES.SUPERFLUID,
    tx: TX.SUPERFLUID_STREAM,
    required: [
      'title',
      'applicant',
      'selectedMinion',
      'targetInk',
      'paymentRequested',
      'superfluidRate',
    ],
    fields: [
      [FIELD.MINION_SELECT, FIELD.TITLE, FIELD.DESCRIPTION, FIELD.LINK],
      [
        FIELD.APPLICANT,
        FIELD.SUPERFLUID_PAYMENT_REQUEST,
        FIELD.SUPERFLUID_RATE,
      ],
    ],
    customValidations: ['nonDaoApplicant', 'streamMinimum', 'noActiveStream'],
  },
};
