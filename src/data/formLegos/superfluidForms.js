import { MINION_TYPES, PROPOSAL_TYPES } from '../../utils/proposalUtils';
import { FIELD } from '../fields';
import { TX } from '../txLegos/contractTX';

export const SUPERFLUID_MINION_FORMS = {
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
  SAFE_SUPERFLUID_STREAM: {
    id: 'SAFE_SUPERFLUID_STREAM',
    title: 'Superfluid Payment Stream',
    description: 'Stream funds through the Safe Minion',
    type: PROPOSAL_TYPES.MINION_SUPERFLUID,
    minionType: MINION_TYPES.SAFE,
    formConditions: ['upgradeToSupertoken', 'withSupertoken'],
    tx: {
      type: 'formCondition',
      withNativeWrapper: TX.SAFE_SUPERFLUID_NATIVE_UPGRADE_N_STREAM,
      upgradeToSupertoken: TX.SAFE_SUPERFLUID_UPGRADE_N_STREAM,
      withSupertoken: TX.SAFE_SUPERFLUID_STREAM,
    },
    required: [
      'title',
      'applicant',
      'selectedMinion',
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
    customValidations: [
      'nonDaoApplicant',
      // TODO: validation impl incomplete -> should check minion balance & then requested payment
      // 'superFluidStreamMinimum',
      'noActiveStream',
    ],
  },
  SUPERFLUID_UPGRADE_TOKEN: {
    id: 'SUPERTOKEN_UPGRADE',
    title: 'Superfluid Token Upgrade Proposal',
    description:
      'Proposal for requesting & upgrading funds to supertokens from the DAO treasury.',
    minionType: MINION_TYPES.SAFE,
    type: PROPOSAL_TYPES.MINION_SUPERFLUID,
    required: ['title', 'applicant'],
    tx: TX.SAFE_SUPERFLUID_UPGRADE_TOKEN,
    fields: [
      [FIELD.TITLE, FIELD.DESCRIPTION, FIELD.LINK],
      [FIELD.MINION_SELECT, FIELD.SUPERFLUID_PAYMENT_REQUEST],
    ],
    // TODO: paymentToken not a supertoken
    // customValidations: ['nonDaoApplicant'],
  },
};
