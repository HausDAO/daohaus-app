import { PROPOSAL_TYPES } from '../../utils/proposalUtils';
import { FIELD } from '../fields';
import { TX } from '../txLegos/contractTX';

//  TOKEN & GUILD_KICK live in favourites.js to prevent duplicates/overwriting
export const CLASSIC_FORMS = {
  MEMBER: {
    id: 'MEMBER',
    title: 'Membership Proposal',
    description: 'Proposal for DAO membership',
    type: PROPOSAL_TYPES.MEMBER,
    required: ['title', 'sharesRequested'], // Use name key from proposal type object
    tx: TX.SUBMIT_PROPOSAL,
    fields: [
      [FIELD.TITLE, FIELD.DESCRIPTION, FIELD.LINK],
      [FIELD.SHARES_REQUEST, FIELD.TRIBUTE],
    ],
    additionalOptions: [
      {
        ...FIELD.APPLICANT,
        label: 'Applicant',
      },
      FIELD.LOOT_REQUEST,
      FIELD.PAYMENT_REQUEST,
    ],
    customValidations: ['nonDaoApplicant'],
  },
  FUNDING: {
    id: 'FUNDING',
    title: 'Funding Proposal',
    description: 'Proposal for transferring funds to/from the DAO treasury.',

    type: PROPOSAL_TYPES.FUNDING,
    required: ['title', 'applicant'], // Use name key from proposal type object
    tx: TX.SUBMIT_PROPOSAL,
    fields: [
      [FIELD.TITLE, FIELD.DESCRIPTION, FIELD.LINK],
      [FIELD.APPLICANT, FIELD.PAYMENT_REQUEST],
    ],
    additionalOptions: [
      FIELD.SHARES_REQUEST,
      FIELD.LOOT_REQUEST,
      FIELD.TRIBUTE,
    ],
    customValidations: ['nonDaoApplicant'],
  },
  TRADE: {
    id: 'TRADE',
    title: 'Swap Tokens for Loot or Shares',
    description: 'Offer to trade your shares, loot, or tokens with the DAO',
    type: PROPOSAL_TYPES.TRADE,
    required: ['title'],
    tx: TX.SUBMIT_PROPOSAL,
    fields: [
      [
        FIELD.TITLE,
        FIELD.TRIBUTE,
        FIELD.DESCRIPTION,
        FIELD.PAYMENT_REQUEST,
        FIELD.LINK,
      ],
    ],
    additionalOptions: [
      FIELD.APPLICANT,
      FIELD.LOOT_REQUEST,
      FIELD.SHARES_REQUEST,
      FIELD.TRIBUTE,
    ],
    customValidations: ['nonDaoApplicant'],
  },
  SIGNAL: {
    id: 'SIGNAL',
    title: 'Signal Proposal',
    description: 'Create an on-chain signal proposal',
    type: PROPOSAL_TYPES.SIGNAL,
    tx: TX.SUBMIT_PROPOSAL,
    required: ['title'], // Use name key from proposal type object
    fields: [[FIELD.TITLE, FIELD.DESCRIPTION, FIELD.LINK, FIELD.TRIBUTE]],
  },
};
