import { MINION_TYPES, PROPOSAL_TYPES } from '../utils/proposalUtils';
import { CONTRACT_MODELS } from '../utils/tokenExplorerApi';
import { TX } from './contractTX';

const INFO_TEXT = {
  SHARES_REQUEST:
    'Shares provide voting power and exposure to assets. Whole numbers only please.',
  LOOT_REQUEST:
    'Loot provides exposure to assets but not voting power. Only whole numbers accepted here, no decimals plz',
  APPLICANT:
    'Address to receive the Shares, Loot, and/or Funding requested in this proposal.',
  TOKEN_TRIBUTE:
    'Only tokens approved by the DAO are allowed here. Members can add more approved tokens with Token proposals',
  PAYMENT_REQUEST: 'Request Funds from the DAO',
  ADDR_KICK: 'Enter the public key of the member you would like to kick.',
  MINION_TYPES: 'Minion funds to be used for this transaction',
  MINION_PAYMENT: `This is the amount of value to be sent from the selected minion's balance`,
  DELEGATE_ADDRESS:
    'Warning: By switching your address to a delegate, you are giving that delegate address the right to act on your behalf.',
};

export const FORM_DISPLAY = {
  LOOT_REQUEST: {
    type: 'lootGrabDisplay',
    name: 'lootRequested',
    listenTo: 'tributeOffered',
    label: 'Loot Requested',
    fallback: '0',
    expectType: 'number',
  },
};

export const FIELD = {
  TITLE: {
    type: 'input',
    label: 'Title',
    name: 'title',
    htmlFor: 'title',
    placeholder: 'Proposal Title',
    expectType: 'any',
  },
  TOKENS: {
    type: 'multiInput',
    label: 'Tokens',
    name: 'tokens',
    htmlFor: 'tokens',
    placeholder: 'tokenAddress',
    expectType: 'arrayStrings',
  },
  DESCRIPTION: {
    type: 'textarea',
    label: 'Description',
    name: 'description',
    htmlFor: 'description',
    placeholder: 'Your description here.',
    expectType: 'any',
  },
  SHARES_REQUEST: {
    type: 'input',
    label: 'Shares Requested',
    name: 'sharesRequested',
    htmlFor: 'shares',
    placeholder: '0',
    info: INFO_TEXT.SHARES_REQUEST,
    expectType: 'integer',
  },
  LOOT_REQUEST: {
    type: 'input',
    label: 'Loot Requested',
    name: 'lootRequested',
    htmlFor: 'loot',
    placeholder: '0',
    info: INFO_TEXT.LOOT_REQUEST,
    expectType: 'integer',
  },
  LINK: {
    type: 'linkInput',
    label: 'Link',
    name: 'link',
    htmlFor: 'link',
    placeholder: 'daolink.club',
    expectType: 'urlNoHTTP',
  },
  APPLICANT: {
    type: 'applicantInput',
    htmlFor: 'applicant',
    name: 'applicant',
    placeholder: '0x',
    label: 'Applicant',
    info: INFO_TEXT.APPLICANT,
    expectType: 'address',
  },
  TRIBUTE: {
    type: 'tributeInput',
    htmlFor: 'tribute',
    name: 'tributeOffered',
    placeholder: '0',
    label: 'Tribute Offered',
    info: INFO_TEXT.TOKEN_TRIBUTE,
    expectType: 'number',
  },
  PAYMENT_REQUEST: {
    type: 'paymentInput',
    htmlFor: 'paymentRequested',
    name: 'paymentRequested',
    placeholder: '0',
    label: 'Payment Requested',
    info: INFO_TEXT.PAYMENT_REQUEST,
    expectType: 'number',
  },
  ONLY_ERC20: {
    type: 'gatedInput',
    only: CONTRACT_MODELS.ERC20,
    label: 'ERC-20 Address',
    name: 'erc20TokenAddress',
    htmlFor: 'erc20TokenAddress',
    placeholder: '0x',
    expectType: 'address',
  },
  ONLY_ERC721: {
    type: 'gatedInput',
    only: CONTRACT_MODELS.ERC721,
    label: 'ERC-721 Address',
    name: 'erc721TokenAddress',
    htmlFor: 'erc20TokenAddress',
    placeholder: '0x',
    expectType: 'address',
  },
  //  Plain old input until token price API can be built
  MINION_PAYMENT: {
    type: 'input',
    htmlFor: 'minionPayment',
    name: 'minionPayment',
    placeholder: '0',
    label: 'Minion Payment',
    info: INFO_TEXT.MINION_PAYMENT,
    expectType: 'number',
  },
  MINION_SELECT: {
    type: 'minionSelect',
    label: 'Select a minion',
    name: 'selectedMinion',
    htmlFor: 'selectedMinion',
    placeholder: 'Choose a DAO minion',
    expectType: 'address',
  },
  ABI_INPUT: {
    type: 'abiInput',
    label: 'Contract Function',
    name: 'abiInput',
    htmlFor: 'abiInput',
    placeholder: '0x',
    expectType: 'string',
  },
  TARGET_CONTRACT: {
    type: 'targetContract',
    label: 'Contract Address',
    name: 'targetContract',
    htmlFor: 'targetContract',
    placeholder: '0x',
    expectType: 'address',
  },
  DELEGATE_ADDRESS: {
    type: 'input',
    htmlFor: 'delegateAddress',
    name: 'delegateAddress',
    placeholder: '0x',
    label: 'Address',
    info: INFO_TEXT.DELEGATE_ADDRESS,
    expectType: 'address',
  },
};

export const FORM = {
  MEMBER: {
    title: 'Membership',
    subtitle: 'Request Shares and/or Loot',
    type: PROPOSAL_TYPES.MEMBER,
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
    title: 'Funding',
    subtitle: 'Request or distribute funds',
    type: PROPOSAL_TYPES.FUNDING,
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
    title: 'Token',
    subtitle: 'Approve a new token.',
    type: PROPOSAL_TYPES.WHITELIST,
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
    title: 'Trade',
    subtitle: 'Remove a Member',
    type: PROPOSAL_TYPES.TRADE,
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
    title: 'Guild Kick',
    subtitle: 'Remove a Member.',
    type: PROPOSAL_TYPES.GUILDKICK,
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
    type: PROPOSAL_TYPES.SIGNAL,
    tx: TX.SUBMIT_PROPOSAL,
    required: ['title'], // Use name key from proposal type object
    fields: [FIELD.TITLE, FIELD.DESCRIPTION, FIELD.LINK],
  },
  MINION: {
    title: 'Minion Proposal',
    subtitle: 'Extend DAO proposals to external contracts',
    type: PROPOSAL_TYPES.MINION_DEFAULT,
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
  UPDATE_DELEGATE: {
    title: 'UPDATE DELEGATE ADDRESS',
    layout: 'singleRow',
    required: ['delegateAddress'],
    tx: TX.UPDATE_DELEGATE,
    fields: [FIELD.DELEGATE_ADDRESS],
  },
  LOOT_GRAB: {
    title: 'Loot Grab proposal',
    layout: 'singleRow',
    subtitle: 'Request loot with a tribute',
    required: ['tributeOffered'],
    tx: TX.LOOT_GRAB_PROPOSAL,
    fields: [FORM_DISPLAY.LOOT_REQUEST, FIELD.TRIBUTE],
  },
};
