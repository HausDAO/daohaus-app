import { MINION_TYPES, PROPOSAL_TYPES } from '../utils/proposalUtils';

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
  DESCRIPTION: {
    type: 'textarea',
    label: 'Description',
    name: 'description',
    htmlFor: 'description',
    placeholder: 'How does that make you feel, champ',
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
    expectType: 'publicKey',
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
  TOKEN_ADDRESS: {
    type: 'input',
    label: 'Token Address',
    name: 'tokenAddress',
    htmlFor: 'tokenAddress',
    placeholder: '0x',
    expectType: 'publicKey',
  },
  MINION_SELECT: {
    type: 'minionSelect',
    label: 'Select a minion',
    name: 'selectedMinion',
    htmlFor: 'selectedMinion',
    placeholder: 'Choose a DAO minion',
    expectType: 'publicKey',
  },
};

export const PROPOSAL_FORMS = {
  MEMBER: {
    title: 'Membership',
    subtitle: 'Request Shares and/or Loot',
    type: PROPOSAL_TYPES.MEMBER,
    required: ['title', 'sharesRequested'], // Use name key from proposal type object
    tx: {
      txType: 'submitProposal',
      contract: 'Moloch',
      errMsg: 'Error submitting proposal',
      successMsg: 'Membership Proposal submitted!',
    },
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
    tx: {
      txType: 'submitProposal',
      contract: 'Moloch',
      errMsg: 'Error submitting proposal',
      successMsg: 'Funding Proposal submitted!',
    },
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
    tx: {
      txType: 'submitWhitelistProposal',
      contract: 'Moloch',
      errMsg: 'Error submitting proposal',
      successMsg: 'Token Proposal submitted!',
    },
    fields: [FIELD.TITLE, FIELD.TOKEN_ADDRESS, FIELD.LINK, FIELD.DESCRIPTION],
  },
  TRADE: {
    title: 'Trade',
    subtitle: 'Remove a Member',
    type: PROPOSAL_TYPES.TRADE,
    required: ['title'],
    tx: {
      txType: 'submitProposal',
      contract: 'Moloch',
      errMsg: 'Error submitting proposal',
      successMsg: 'Trade Proposal submitted!',
    },
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
    tx: {
      txType: 'submitGuildKickProposal',
      pollType: 'submitProposal', //  Overwrites standard txType in cases where txType isn't used for Poll Action
      contract: 'Moloch',
      errMsg: 'Error submitting proposal',
      successMsg: 'Guild Kick Proposal submitted!',
    },
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
    tx: {
      txType: 'submitProposal',
      contract: 'Moloch',
    },
    required: ['title'], // Use name key from proposal type object
    fields: [FIELD.TITLE, FIELD.DESCRIPTION, FIELD.LINK],
  },
  MINION: {
    title: 'Minion Proposal',
    subtitle: 'Extend DAO proposals to external contracts',
    type: PROPOSAL_TYPES.MINION_DEFAULT,
    required: ['targetContract', 'title', 'selectedMinion'], // Use name key from proposal type object
    minionType: MINION_TYPES.VANILLA,
    tx: {
      txType: 'submitProposal',
      contract: 'Moloch',
      errMsg: 'Error submitting proposal',
      successMsg: 'Membership Proposal submitted!',
    },
    fields: [
      FIELD.TITLE,
      FIELD.MINION_SELECT,
      FIELD.SHARES_REQUEST,
      FIELD.DESCRIPTION,
    ],
  },
};
