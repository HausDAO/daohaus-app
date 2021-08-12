import { MINION_TYPES, PROPOSAL_TYPES } from '../utils/proposalUtils';
import { FIELD, INFO_TEXT, FORM_DISPLAY } from './fields';
import { TX } from './contractTX';

export const CORE_FORMS = {
  EDIT_PLAYLIST: {
    id: 'EDIT_PLAYLIST',
    title: 'Edit Proposal Playlist',
    type: PROPOSAL_TYPES.CORE,
    required: ['title'],
    fields: [
      [
        {
          ...FIELD.TITLE,
          helperText: 'Max 100 characters',
          placeholder: 'Playlist Title',
        },
      ],
    ],
  },
  ADD_PLAYLIST: {
    id: 'ADD_PLAYLIST',
    title: 'Add a Proposal Playlist',
    type: PROPOSAL_TYPES.CORE,
    required: ['selectedMinion'],
    fields: [
      [
        {
          ...FIELD.TITLE,
          helperText: 'Max 100 characters',
          placeholder: 'Playlist Title',
        },
      ],
    ],
  },
  UPDATE_DELEGATE: {
    id: 'UPDATE_DELEGATE',
    title: 'UPDATE DELEGATE ADDRESS',
    required: ['delegateAddress'],
    tx: TX.UPDATE_DELEGATE,
    fields: [FIELD.DELEGATE_ADDRESS],
  },
  EDIT_PROPOSAL: {
    id: 'EDIT_PROPOSAL',
    title: 'Edit Proposal',
    type: PROPOSAL_TYPES.CORE,
    required: ['title', 'description'],
    fields: [
      [
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
    ],
  },
  MINION_SEND_NETWORK_TOKEN: {
    id: 'MINION_SEND_NETWORK_TOKEN',
    title: 'Network Token Transfer',
    subtitle: 'Make a proposal to transfer tokens out of the minion',
    type: PROPOSAL_TYPES.MINION_NATIVE,
    required: ['minionPayment', 'applicant', 'description'],
    minionType: MINION_TYPES.VANILLA,
    tx: TX.MINION_SEND_NETWORK_TOKEN,
    fields: [[FIELD.MINION_PAYMENT, FIELD.APPLICANT, FIELD.DESCRIPTION]],
  },
  MINION_SEND_ERC20_TOKEN: {
    id: 'MINION_SEND_ERC20_TOKEN',
    title: 'ERC20 Token Transfer',
    subtitle: 'Make a proposal to transfer tokens out of the minion',
    type: PROPOSAL_TYPES.MINION_ERC20,
    required: ['minionPayment', 'applicant'],
    minionType: MINION_TYPES.VANILLA,
    tx: TX.MINION_SEND_ERC20_TOKEN,
    fields: [[FIELD.MINION_PAYMENT, FIELD.APPLICANT, FIELD.DESCRIPTION]],
  },
  MINION_SEND_ERC721_TOKEN: {
    id: 'MINION_SEND_ERC721_TOKEN',
    title: 'ERC721 Token Transfer',
    subtitle: 'Make a proposal to transfer the nft out of the minion',
    type: PROPOSAL_TYPES.MINION_ERC721,
    required: ['applicant'],
    minionType: MINION_TYPES.VANILLA,
    tx: TX.MINION_SEND_ERC721_TOKEN,
    fields: [[FIELD.APPLICANT, FIELD.DESCRIPTION]],
  },
  MINION_SELL_NIFTY: {
    id: 'MINION_SELL_NIFTY',
    title: 'Sell Nifty ERC721',
    subtitle: 'Make a proposal to set the price of the nft on nifty.ink',
    type: PROPOSAL_TYPES.MINION_NIFTY_SELL,
    required: ['price'],
    minionType: MINION_TYPES.VANILLA,
    tx: TX.MINION_NIFTY_SET_PRICE,
    fields: [[FIELD.NFT_PRICE, FIELD.DESCRIPTION]],
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
    playlists: { favorites: true },
    type: PROPOSAL_TYPES.MEMBER,
    tx: TX.SUBMIT_PROPOSAL,
    required: ['sharesRequested', 'link', 'title'],
    fields: [
      [FIELD.TITLE, FIELD.SHARES_REQUEST, FIELD.LINK, FIELD.DESCRIPTION],
    ],
    additionalOptions: [FIELD.PAYMENT_REQUEST, FIELD.SHARES_REQUEST],
  },
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
      FIELD.APPLICANT,
      FIELD.LOOT_REQUEST,
      FIELD.PAYMENT_REQUEST,
    ],
  },
  FUNDING: {
    id: 'FUNDING',
    title: 'Funding Proposal',
    description: 'Proposal for transferring funds to/from the DAO treasury.',
    origin: 'classics',
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
        FIELD.DESCRIPTION,
        FIELD.LINK,
      ],
    ],
  },
  SIGNAL: {
    id: 'SIGNAL',
    title: 'Signal Proposal',
    description: 'Create an on-chain signal proposal',
    type: PROPOSAL_TYPES.SIGNAL,
    tx: TX.SUBMIT_PROPOSAL,
    required: ['title'], // Use name key from proposal type object
    fields: [[FIELD.TITLE, FIELD.DESCRIPTION, FIELD.LINK]],
  },
  MINION: {
    id: 'MINION',
    title: 'Minion Proposal',
    description: 'Extend DAO proposals to external contracts',
    type: PROPOSAL_TYPES.MINION_DEFAULT,
    required: ['targetContract', 'title', 'selectedMinion'], // Use name key from proposal type object
    minionType: MINION_TYPES.VANILLA,
    tx: TX.MINION_PROPOSE_ACTION,
    fields: [
      [
        FIELD.TITLE,
        FIELD.MINION_SELECT,
        FIELD.TARGET_CONTRACT,
        FIELD.ABI_INPUT,
      ],
    ],
    additionalOptions: [
      FIELD.MINION_PAYMENT,
      { ...FIELD.DESCRIPTION, h: '10' },
    ],
  },
  UPDATE_DELEGATE: {
    title: 'UPDATE DELEGATE ADDRESS',
    required: ['delegateAddress'],
    tx: TX.UPDATE_DELEGATE,
    fields: [[FIELD.DELEGATE_ADDRESS]],
  },
  LOOT_GRAB: {
    id: 'LOOT_GRAB',
    title: 'Loot Grab proposal',
    description: 'Trade ERC-20s for DAO loot',
    required: ['tributeOffered'],
    tx: TX.LOOT_GRAB_PROPOSAL,
    fields: [[FORM_DISPLAY.LOOT_REQUEST, FIELD.TRIBUTE]],
  },
  PAYROLL: {
    id: 'PAYROLL',
    title: 'Payroll Proposal',
    description: 'Pay Members with a minion',
    type: PROPOSAL_TYPES.PAYROLL,
    required: ['selectedMinion', 'minionPayment', 'applicant'],
    minionType: MINION_TYPES.VANILLA,
    tx: TX.PAYROLL,
    fields: [
      [
        FIELD.MINION_SELECT,
        FIELD.MINION_PAYMENT,
        FIELD.APPLICANT,
        FIELD.DESCRIPTION,
      ],
    ],
  },
  MINION_SEND_NETWORK_TOKEN: {
    title: 'Network Token Transfer',
    subtitle: 'Make a proposal to transfer tokens out of the minion',
    type: PROPOSAL_TYPES.MINION_NATIVE,
    required: ['minionPayment', 'applicant', 'description'],
    minionType: MINION_TYPES.VANILLA,
    tx: TX.MINION_SEND_NETWORK_TOKEN,
    fields: [[FIELD.MINION_PAYMENT, FIELD.APPLICANT, FIELD.DESCRIPTION]],
  },
  MINION_SEND_ERC20_TOKEN: {
    title: 'ERC20 Token Transfer',
    subtitle: 'Make a proposal to transfer tokens out of the minion',
    type: PROPOSAL_TYPES.MINION_ERC20,
    required: ['minionPayment', 'applicant'],
    minionType: MINION_TYPES.VANILLA,
    tx: TX.MINION_SEND_ERC20_TOKEN,
    fields: [[FIELD.MINION_PAYMENT, FIELD.APPLICANT, FIELD.DESCRIPTION]],
  },
  SELL_NFT_RARIBLE: {
    id: 'SELL_NFT_RARIBLE',
    title: 'Sell NFT on Rarible',
    subtitle: 'Post an NFT for sale on Rarible',
    description: 'Post an NFT for sale on Rarible',
    type: PROPOSAL_TYPES.SELL_NFT,
    minionType: MINION_TYPES.NEAPOLITAN,
    tx: TX.SELL_NFT_RARIBLE,
    fields: [
      [FIELD.NFT_SELECT],
      [FIELD.MINION_SELECT, FIELD.DATE_RANGE, FIELD.SET_PRICE],
    ],
  },
  MINION_SEND_ERC721_TOKEN: {
    title: 'ERC721 Token Transfer',
    subtitle: 'Make a proposal to transfer the nft out of the minion',
    type: PROPOSAL_TYPES.MINION_ERC721,
    required: ['applicant'],
    minionType: MINION_TYPES.VANILLA,
    tx: TX.MINION_SEND_ERC721_TOKEN,
    fields: [[FIELD.APPLICANT, FIELD.DESCRIPTION]],
  },
  MINION_SELL_NIFTY: {
    title: 'Sell Nifty ERC721',
    subtitle: 'Make a proposal to set the price of the nft on nifty.ink',
    type: PROPOSAL_TYPES.MINION_NIFTY_SELL,
    required: ['price'],
    minionType: MINION_TYPES.VANILLA,
    tx: TX.MINION_SELL_NIFTY,
    fields: [[FIELD.NFT_PRICE, FIELD.DESCRIPTION]],
  },
  NEW_NEAPOLITAN_MINION: {
    required: ['minQuorum', 'minionName'],
    tx: TX.SUMMON_MINION_NEAPOLITAN,
    fields: [[FIELD.MINION_NAME, FIELD.MINION_QUORUM]],
  },
  NEW_NIFTY_MINION: {
    required: ['minQuorum', 'minionName'],
    tx: TX.SUMMON_MINION_NIFTY,
    fields: [[FIELD.MINION_NAME, FIELD.MINION_QUORUM]],
  },
  NEW_VANILLA_MINION: {
    required: ['minionName'],
    tx: TX.SUMMON_MINION_VANILLA,
    fields: [[FIELD.MINION_NAME]],
  },
  BUY_NIFTY_INK: {
    id: 'BUY_NIFTY_INK',
    title: 'Buy a NiftyInk',
    description: 'Make a proposal to buy an NFT for the Nifty Minion vault',
    type: PROPOSAL_TYPES.BUY_NIFTY_INK,
    minionType: MINION_TYPES.NIFTY,
    tx: TX.MINION_BUY_NIFTY_INK,
    required: ['selectedMinion', 'targetInk', 'paymentRequested'],
    fields: [
      [FIELD.NIFTY_INK_URL],
      [FIELD.MINION_SELECT, FIELD.NIFTY_MINION_PAYMENT_REQUEST],
    ],
  },
  SUPERFLUID_STREAM: {
    id: 'SUPERFLUID_STREAM',
    title: 'Superfluid Payment Stream',
    description: 'Stream funds from the Superfluid Minion',
    type: PROPOSAL_TYPES.MINION_SUPERFLUID,
    minionType: MINION_TYPES.SUPERFLUID,
    tx: TX.SUPERFLUID_PROPOSE_ACTION,
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
