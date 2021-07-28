import { MINION_TYPES, PROPOSAL_TYPES } from '../utils/proposalUtils';
import { FIELD, INFO_TEXT, FORM_DISPLAY } from './fields';
import { TX } from './contractTX';

export const CORE_FORMS = {
  EDIT_PLAYLIST: {
    id: 'EDIT_PLAYLIST',
    title: 'Edit Proposal Playlist',
    layout: 'singleColumn',
    type: PROPOSAL_TYPES.CORE,
    required: ['title'],
    fields: [
      {
        ...FIELD.TITLE,
        helperText: 'Max 100 characters',
        placeholder: 'Playlist Title',
      },
    ],
  },
  ADD_PLAYLIST: {
    id: 'ADD_PLAYLIST',
    title: 'Add a Proposal Playlist',
    layout: 'singleColumn',
    type: PROPOSAL_TYPES.CORE,
    required: ['selectedMinion'],
    fields: [
      {
        ...FIELD.TITLE,
        helperText: 'Max 100 characters',
        placeholder: 'Playlist Title',
      },
    ],
  },
  UPDATE_DELEGATE: {
    id: 'UPDATE_DELEGATE',
    title: 'UPDATE DELEGATE ADDRESS',
    layout: 'singleColumn',
    required: ['delegateAddress'],
    tx: TX.UPDATE_DELEGATE,
    fields: [FIELD.DELEGATE_ADDRESS],
  },
  EDIT_PROPOSAL: {
    id: 'EDIT_PROPOSAL',
    title: 'Edit Proposal',
    layout: 'singleColumn',
    type: PROPOSAL_TYPES.CORE,
    required: ['title', 'description'],
    fields: [
      {
        ...FIELD.TITLE,
        helperText: 'Max 30 characters',
        placeholder: 'Proposal Title',
      },
      {
        ...FIELD.DESCRIPTION,
        helperText: 'Max 100 characters',
        placeholder: 'proposal Title',
      },
    ],
  },
};

export const FORM = {
  BUY_SHARES: {
    id: 'BUY_SHARES',
    title: 'Request shares for tokens',
    description: 'Request shares from the DAO in exchange for ERC-20 tokens',
    playlists: { favorites: true },
    type: PROPOSAL_TYPES.MEMBER,
    tx: TX.SUBMIT_PROPOSAL,
    layout: 'singleColumn',
    required: ['sharesRequested', 'tributeOffered', 'title'],
    fields: [
      FIELD.TITLE,
      FIELD.SHARES_REQUEST,
      FIELD.TRIBUTE,
      FIELD.DESCRIPTION,
    ],
    additionalOptions: [FIELD.LINK],
  },
  SHARES_FOR_WORK: {
    id: 'SHARES_FOR_WORK',
    title: 'Request shares for work completed',
    description: 'Request shares from the DAO by showing finished work.',
    playlists: { favorites: true },
    type: PROPOSAL_TYPES.MEMBER,
    layout: 'singleColumn',
    tx: TX.SUBMIT_PROPOSAL,
    required: ['sharesRequested', 'link', 'title'],
    fields: [FIELD.TITLE, FIELD.SHARES_REQUEST, FIELD.LINK, FIELD.DESCRIPTION],
    additionalOptions: [FIELD.PAYMENT_REQUEST, FIELD.SHARES_REQUEST],
  },
  MEMBER: {
    id: 'MEMBER',
    title: 'Request To Join',
    description: 'Create a proposal and apply for DAO membership',
    type: PROPOSAL_TYPES.MEMBER,
    layout: 'doubleColumn',
    required: ['title', 'sharesRequested'], // Use name key from proposal type object
    tx: TX.SUBMIT_PROPOSAL,
    fields: [
      FIELD.TITLE,
      FIELD.SHARES_REQUEST,
      FIELD.DESCRIPTION,
      FIELD.TRIBUTE,
      FIELD.LINK,
    ],
    additionalOptions: [
      FIELD.APPLICANT,
      FIELD.LOOT_REQUEST,
      FIELD.PAYMENT_REQUEST,
    ],
  },
  FUNDING: {
    id: 'FUNDING',
    title: 'Request Shares and/or Loot',
    description: 'Transfer funds to/from the DAO treasury',
    origin: 'classics',
    type: PROPOSAL_TYPES.FUNDING,
    layout: 'doubleColumn',
    required: ['title', 'applicant'], // Use name key from proposal type object
    tx: TX.SUBMIT_PROPOSAL,
    fields: [
      FIELD.TITLE,
      FIELD.APPLICANT,
      FIELD.DESCRIPTION,
      FIELD.PAYMENT_REQUEST,
      FIELD.LINK,
    ],
    additionalOptions: [
      FIELD.SHARES_REQUEST,
      FIELD.LOOT_REQUEST,
      FIELD.TRIBUTE,
    ],
    customValidations: ['nonDaoApplicant'],
  },
  TOKEN: {
    id: 'TOKEN',
    title: 'Whitelist a new token',
    description: 'Create a proposal to add a new token to the DAO treasury.',
    origin: 'classics',
    type: PROPOSAL_TYPES.WHITELIST,
    layout: 'doubleColumn',
    required: ['title', 'tokenAddress'], // Use name key from proposal type object
    tx: TX.WHITELIST_TOKEN_PROPOSAL,
    fields: [
      FIELD.TITLE,
      { ...FIELD.ONLY_ERC20, name: 'tokenAddress' },
      FIELD.LINK,
      FIELD.DESCRIPTION,
    ],
  },
  TRADE: {
    id: 'TRADE',
    title: 'Swap Tokens for Loot or Shares',
    description: 'Offer to trade your shares, loot, or tokens with the DAO',
    type: PROPOSAL_TYPES.TRADE,
    layout: 'singleColumn',
    required: ['title'],
    tx: TX.SUBMIT_PROPOSAL,
    fields: [
      FIELD.TITLE,
      FIELD.TRIBUTE,
      FIELD.DESCRIPTION,
      FIELD.PAYMENT_REQUEST,
      FIELD.LINK,
    ],
    additionalOptions: [
      FIELD.APPLICANT,
      FIELD.LOOT_REQUEST,
      FIELD.SHARES_REQUEST,
    ],
  },
  GUILDKICK: {
    id: 'GUILDKICK',
    title: 'Guild Kick',
    description: 'Create a proposal to kick a member',
    origin: 'classics',
    type: PROPOSAL_TYPES.GUILDKICK,
    layout: 'singleColumn',
    required: ['title', 'applicant'], // Use name key from proposal type object
    tx: TX.GUILDKICK_PROPOSAL,
    fields: [
      FIELD.TITLE,
      {
        ...FIELD.APPLICANT,
        label: 'Member to Kick',
        info: INFO_TEXT.ADDR_KICK,
      },
      FIELD.DESCRIPTION,
      FIELD.LINK,
    ],
  },
  SIGNAL: {
    id: 'SIGNAL',
    title: 'Signal Proposal',
    description: 'Create an on-chain signal proposal',
    type: PROPOSAL_TYPES.SIGNAL,
    tx: TX.SUBMIT_PROPOSAL,
    layout: 'singleColumn',
    required: ['title'], // Use name key from proposal type object
    fields: [FIELD.TITLE, FIELD.DESCRIPTION, FIELD.LINK],
  },
  MINION: {
    id: 'MINION',
    title: 'Minion Proposal',
    description: 'Extend DAO proposals to external contracts',
    type: PROPOSAL_TYPES.MINION_DEFAULT,
    layout: 'doubleColumn',
    required: ['targetContract', 'title', 'selectedMinion'], // Use name key from proposal type object
    minionType: MINION_TYPES.VANILLA,
    tx: TX.MINION_PROPOSE_ACTION,
    fields: [
      FIELD.TITLE,
      FIELD.MINION_SELECT,
      FIELD.TARGET_CONTRACT,
      FIELD.ABI_INPUT,
    ],
    additionalOptions: [
      FIELD.MINION_PAYMENT,
      { ...FIELD.DESCRIPTION, h: '10' },
    ],
  },
  LOOT_GRAB: {
    id: 'LOOT_GRAB',
    title: 'Loot Grab proposal',
    description: 'Trade ERC-20s for DAO loot',
    layout: 'singleColumn',
    required: ['tributeOffered'],
    tx: TX.LOOT_GRAB_PROPOSAL,
    fields: [FORM_DISPLAY.LOOT_REQUEST, FIELD.TRIBUTE],
  },
  PAYROLL: {
    id: 'PAYROLL',
    title: 'Payroll Proposal',
    description: 'Pay Members with a minion',
    layout: 'singleColumn',
    type: PROPOSAL_TYPES.PAYROLL,
    required: ['selectedMinion', 'minionPayment', 'applicant'],
    minionType: MINION_TYPES.VANILLA,
    tx: TX.PAYROLL,
    fields: [
      FIELD.MINION_SELECT,
      FIELD.MINION_PAYMENT,
      FIELD.APPLICANT,
      FIELD.DESCRIPTION,
    ],
  },
};

// export const LOCAL_PLAYLISTS = {
//   favorites: 'Favorites',
//   classics: 'The Classics',
//   vanillaMinion: 'Vanilla Minion',
// };

// export const ALL_FORMS = {
//   name: 'All Proposals',
//   id: 'all',
//   forms: Object.values(FORM),
// };
// export const PLAYLISTS = [
//   ...Object.entries(LOCAL_PLAYLISTS).map(list => ({
//     id: list[0],
//     name: list[1],
//     forms: ALL_FORMS.forms.filter(form => form.playlists[list[0]]),
//   })),
//   ALL_FORMS,
// ];
