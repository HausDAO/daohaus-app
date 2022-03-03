import { PROPOSAL_TYPES } from '../../utils/proposalUtils';
import { FIELD, INFO_TEXT } from '../fields';
import { TX } from '../txLegos/contractTX';

export const FAVOURITE_FORMS = {
  BUY_SHARES: {
    id: 'BUY_SHARES',
    title: 'Request shares for tokens',
    description: 'Request shares from the DAO in exchange for ERC-20 tokens',
    type: PROPOSAL_TYPES.MEMBER,
    tx: TX.SUBMIT_PROPOSAL,
    required: ['sharesRequested', 'tributeOffered', 'title'],
    fields: [
      [FIELD.TITLE, FIELD.SHARES_REQUEST, FIELD.TRIBUTE, FIELD.DESCRIPTION],
    ],
    additionalOptions: [FIELD.LINK],
  },
  SHARES_FOR_WORK: {
    id: 'SHARES_FOR_WORK',
    title: 'Request shares for work completed',
    description: 'Request shares from the DAO by showing finished work.',
    type: PROPOSAL_TYPES.MEMBER,
    tx: TX.SUBMIT_PROPOSAL,
    required: ['sharesRequested', 'link', 'title'],
    fields: [
      [FIELD.TITLE, FIELD.SHARES_REQUEST, FIELD.LINK, FIELD.DESCRIPTION],
    ],
    additionalOptions: [FIELD.PAYMENT_REQUEST, FIELD.TRIBUTE],
  },
  TOKEN: {
    id: 'TOKEN',
    title: 'Whitelist a new token',
    description: 'Create a proposal to add a new token to the DAO treasury.',
    origin: 'classics',
    type: PROPOSAL_TYPES.WHITELIST,
    required: ['title', 'tokenAddress'], // Use name key from proposal type object
    tx: TX.WHITELIST_TOKEN_PROPOSAL,
    fields: [
      [
        FIELD.TITLE,
        { ...FIELD.ONLY_ERC20, name: 'tokenAddress' },
        FIELD.LINK,
        FIELD.DESCRIPTION,
      ],
    ],
  },
  GUILDKICK: {
    id: 'GUILDKICK',
    title: 'Guild Kick',
    description: 'Create a proposal to kick a member',
    origin: 'classics',
    type: PROPOSAL_TYPES.GUILDKICK,
    required: ['title', 'applicant'], // Use name key from proposal type object
    tx: TX.GUILDKICK_PROPOSAL,
    fields: [
      [
        FIELD.TITLE,
        {
          ...FIELD.APPLICANT,
          label: 'Member to Kick',
          info: INFO_TEXT.ADDR_KICK,
        },
        {
          type: 'memberImpact',
        },
        FIELD.DESCRIPTION,
        FIELD.LINK,
      ],
    ],
  },
};
