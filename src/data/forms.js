import { FIELD, INFO_TEXT, FORM_DISPLAY } from './fields';
import { MINION_TYPES, PROPOSAL_TYPES } from '../utils/proposalUtils';
import { TX } from './contractTX';
import { VAULT_TRANSFER_TX } from './transferContractTx';

export const CORE_FORMS = {
  EDIT_PLAYLIST: {
    id: 'EDIT_PLAYLIST',
    subtitle: 'Edit Proposal Playlist',
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
          label: 'Playlist Name',
          helperText: 'Max 100 characters',
          placeholder: 'Playlist Name',
        },
      ],
    ],
  },
  UPDATE_DELEGATE: {
    id: 'UPDATE_DELEGATE',
    title: 'Update delegate address',
    required: ['delegateAddress'],
    tx: TX.UPDATE_DELEGATE,
    fields: [[FIELD.DELEGATE_ADDRESS]],
  },
  EDIT_PROPOSAL: {
    id: 'EDIT_PROPOSAL',
    title: 'Edit Proposal',
    type: PROPOSAL_TYPES.CORE,
    required: ['title', 'description'],
    fields: [
      [
        FIELD.PROPOSAL_NAME,
        {
          ...FIELD.DESCRIPTION,
          helperText: 'Max 100 characters',
          placeholder: 'Proposal Description',
        },
      ],
    ],
  },
  MINION_SELL_NIFTY: {
    id: 'MINION_SELL_NIFTY',
    title: 'Sell Nifty ERC721',
    description: 'Make a proposal to set the price of the nft on nifty.ink',
    type: PROPOSAL_TYPES.MINION_NIFTY_SELL,
    required: ['price'],
    minionType: MINION_TYPES.VANILLA,
    tx: TX.MINION_SELL_NIFTY,
    fields: [[FIELD.NFT_PRICE, FIELD.DESCRIPTION]],
  },
  SUMMON_MINION_SELECTOR: {
    id: 'SUMMON_MINION_SELECTOR',
    title: 'Select a Minion',
    required: ['minionType'],
    fields: [[FIELD.MINION_TYPE_SELECT]],
  },
  RAGE_QUIT: {
    customValidations: ['canRagequit', 'rageQuitMinimum', 'rageQuitMax'],
    id: 'RAGE_QUIT',
    title: 'Rage Quit',
    required: [],
    tx: TX.RAGE_QUIT,
    fields: [
      [
        FIELD.RAGE_QUIT_INPUT,
        {
          ...FIELD.RAGE_QUIT_INPUT,
          htmlFor: 'loot',
          label: 'Loot to Rage',
          name: 'loot',
        },
      ],
    ],
  },
};

export const FORM = {
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
    additionalOptions: [FIELD.PAYMENT_REQUEST],
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
      {
        ...FIELD.APPLICANT,
        label: 'Applicant',
      },
      FIELD.LOOT_REQUEST,
      FIELD.PAYMENT_REQUEST,
    ],
    customValidations: ['nonDaoApplicant'],
  },
  PROFILE: {
    id: 'PROFILE',
    title: 'Update Basic Profile',
    description:
      'Editing this profile will update your profile everywhere Ceramic is used',
    required: ['residenceCountry'], // Use name key from proposal type object
    tx: null,
    ctaText: 'Connect',
    blurText: 'Connect to update your profile',
    fields: [
      [
        {
          ...FIELD.TITLE,
          label: 'Name',
          name: 'name',
          placeholder: 'A name for your porfile',
          htmlFor: 'name',
          expectType: 'string',
        },
        {
          ...FIELD.DESCRIPTION,
          label: 'Bio',
          name: 'description',
          htmlFor: 'description',
          placeholder: 'A description about yourself',
          expectType: 'string',
        },
        {
          ...FIELD.TITLE,
          label: 'Spirit Emoji',
          name: 'emoji',
          placeholder: 'An emoji to represent who you are',
          htmlFor: 'emoji',
          expectType: 'string',
        },
      ],
      [
        {
          ...FIELD.TITLE,
          label: 'Url',
          name: 'url',
          placeholder: 'https://example.com',
          htmlFor: 'url',
          expectType: 'url',
        },
        {
          ...FIELD.TITLE,
          label: 'Location',
          name: 'homeLocation',
          placeholder: 'A location where you are or hope to be',
          htmlFor: 'homeLocation',
          expectType: 'string',
        },

        {
          ...FIELD.TITLE,
          label: '2-Letter Country Code',
          name: 'residenceCountry',
          placeholder: 'US',
          htmlFor: 'residenceCountry',
          expectType: 'string',
          info: 'An ISO 3166-1 alpha-2 compliant country code',
        },
      ],
    ],
    additionalOptions: [],
    customValidations: [],
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
    customValidations: ['nonDaoApplicant'],
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
  MINION_SAFE_SIMPLE: {
    id: 'MINION_SAFE_SIMPLE',
    title: 'Minion Proposal',
    description: 'Extend DAO proposals to external contracts',
    type: PROPOSAL_TYPES.MINION_DEFAULT,
    required: ['targetContract', 'title', 'selectedMinion'], // Use name key from proposal type object
    minionType: MINION_TYPES.SAFE,
    tx: TX.MINION_PROPOSE_ACTION_SAFE,
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
  PAYROLL_NIFTY: {
    id: 'PAYROLL_NIFTY',
    title: 'Payroll Proposal',
    description: 'Pay Members with a minion',
    type: PROPOSAL_TYPES.PAYROLL,
    required: ['selectedMinion', 'minionPayment', 'applicant'],
    minionType: MINION_TYPES.NIFTY,
    tx: TX.PAYROLL_NIFTY,
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
    description: 'Make a proposal to transfer tokens out of the minion',
    type: PROPOSAL_TYPES.MINION_NATIVE,
    required: ['minionPayment', 'applicant', 'description'],
    minionType: MINION_TYPES.VANILLA,
    tx: VAULT_TRANSFER_TX.MINION_SEND_NETWORK_TOKEN,
    fields: [[FIELD.MINION_PAYMENT, FIELD.APPLICANT, FIELD.DESCRIPTION]],
  },
  MINION_SEND_ERC20_TOKEN: {
    title: 'ERC20 Token Transfer',
    description: 'Make a proposal to transfer tokens out of the minion',
    type: PROPOSAL_TYPES.MINION_ERC20,
    required: ['minionPayment', 'applicant'],
    minionType: MINION_TYPES.VANILLA,
    tx: VAULT_TRANSFER_TX.MINION_SEND_ERC20_TOKEN,
    fields: [[FIELD.MINION_PAYMENT, FIELD.APPLICANT, FIELD.DESCRIPTION]],
  },
  MINION_SEND_ERC721_TOKEN: {
    title: 'ERC721 Token Transfer',
    description: 'Make a proposal to transfer the nft out of the minion',
    type: PROPOSAL_TYPES.MINION_ERC721,
    required: ['applicant'],
    minionType: MINION_TYPES.VANILLA,
    tx: VAULT_TRANSFER_TX.MINION_SEND_ERC721_TOKEN,
    fields: [
      [
        FIELD.NFT_SELECT,
        FIELD.MINION_SELECT,
        FIELD.APPLICANT,
        FIELD.DESCRIPTION,
      ],
    ],
  },
  MINION_SEND_ERC1155_TOKEN: {
    title: 'ERC1155 Token Transfer',
    description: 'Make a proposal to transfer the nft out of the minion',
    type: PROPOSAL_TYPES.MINION_ERC1155,
    required: ['applicant'],
    minionType: MINION_TYPES.VANILLA,
    tx: VAULT_TRANSFER_TX.MINION_SEND_ERC1155_TOKEN,
    fields: [
      [
        FIELD.NFT_SELECT,
        FIELD.MINION_SELECT,
        FIELD.APPLICANT,
        FIELD.DESCRIPTION,
      ],
    ],
  },
  SAMPLE_CONDITIONAL: {
    // dev: true,
    // logValues: true,
    id: 'SAMPLE_CONDITIONAL',
    formConditions: ['signal', 'token'],
    title: 'Conditional Form',
    description: 'Conditional Description',
    type: PROPOSAL_TYPES.FUNDING,
    tx: {
      type: 'formCondition',
      token: TX.WHITELIST_TOKEN_PROPOSAL,
      signal: TX.SUBMIT_PROPOSAL,
    },
    required: ['title'],
    fields: [
      [
        FIELD.TEST_SWITCH,
        FIELD.TITLE,
        { ...FIELD.TEST_GATE, renderOnCheck: FIELD.DESCRIPTION },
        {
          type: 'formCondition',
          token: { ...FIELD.ONLY_ERC20, name: 'tokenAddress' },
          signal: FIELD.LINK,
        },
      ],
    ],
  },
  MINION_BUYOUT_TOKEN: {
    id: 'MINION_BUYOUT_TOKEN',
    title: 'Buyout Proposal',
    description: 'Request funds as buyout',
    type: PROPOSAL_TYPES.MINION_BUYOUT,
    minionType: MINION_TYPES.SAFE,
    tx: TX.SET_BUYOUT_TOKEN,
    required: ['selectedMinion', 'title', 'paymentRequested'],
    fields: [
      [
        { ...FIELD.MINION_SELECT, info: INFO_TEXT.BUYOUT_MINION },
        FIELD.TITLE,
        FIELD.DESCRIPTION,
        FIELD.LINK,
      ],
      [FIELD.BUYOUT_PAYMENT_REQUEST],
    ],
  },
  MINION_TRIBUTE: {
    id: 'MINION_TRIBUTE',
    title: 'NFT Tribute',
    subtitle: 'Offer NFT as Tribute',
    description:
      'Offer an NFT as tribute to the DAO. Optionally, offer or request some funds as well.',
    type: PROPOSAL_TYPES.MINION_TRIBUTE,
    minionType: MINION_TYPES.SAFE,
    tx: TX.OFFER_NFT_TRIBUTE,
    required: [
      'title',
      'nftAddress',
      'tokenId',
      'selectedMinion',
      'nftApproval',
      'sharesRequested',
      'lootRequested',
      'paymentRequested',
    ],
    fields: [
      [
        FIELD.TITLE,
        FIELD.DESCRIPTION,
        FIELD.LINK,
        { ...FIELD.MINION_SELECT, info: INFO_TEXT.TRIBUTE_MINION },
      ],
      [
        FIELD.NFT_INPUT,
        FIELD.NFT_APPROVAL,
        FIELD.TOKEN_INFO_INPUT,
        FIELD.SHARES_REQUEST,
        FIELD.LOOT_REQUEST,
        FIELD.PAYMENT_REQUEST,
      ],
    ],
  },
  MINION_SELL_NIFTY: {
    title: 'Sell Nifty ERC721',
    description: 'Make a proposal to set the price of the nft on nifty.ink',
    type: PROPOSAL_TYPES.MINION_NIFTY_SELL,
    required: ['price'],
    minionType: MINION_TYPES.VANILLA,
    tx: TX.MINION_SELL_NIFTY,
    fields: [[FIELD.NFT_PRICE, FIELD.DESCRIPTION]],
  },
  NEW_SAFE_MINION: {
    formConditions: ['easy', 'advanced'],
    tx: {
      type: 'formCondition',
      easy: TX.SUMMON_MINION_AND_SAFE,
      advanced: TX.SUMMON_MINION_SAFE,
    },
    // required: { // TODO: how to do required input validation dinamically
    //   type: 'formCondition',
    //   easy: ['minionName', 'minQuorum', 'saltNonce'],
    //   advanced: ['minionName', 'safeAddress', 'minQuorum', 'saltNonce'],
    // },
    required: ['minionName', 'minQuorum', 'saltNonce'],
    fields: [
      [
        FIELD.SUMMON_MODE_SWITCH,
        FIELD.MINION_NAME,
        {
          type: 'formCondition',
          easy: null,
          advanced: FIELD.ONLY_SAFE,
        },
        FIELD.MINION_QUORUM,
        FIELD.SALT_NONCE,
      ],
    ],
  },
  NEW_SAFE_MINION_ADVANCED: {
    customValidations: ['noExistingSafeMinion'],
    required: ['minionName', 'safeAddress', 'minQuorum', 'saltNonce'],
    tx: TX.SUMMON_MINION_SAFE,
    fields: [
      [
        FIELD.MINION_NAME,
        FIELD.ONLY_SAFE,
        FIELD.MINION_QUORUM,
        FIELD.SALT_NONCE,
      ],
    ],
    warningMsg:
      'WARNING: you MUST add the new minion as a Safe module after deployment',
  },
  NEW_NIFTY_MINION: {
    required: ['minQuorum', 'minionName'],
    tx: TX.SUMMON_MINION_NIFTY,
    fields: [[FIELD.MINION_NAME, FIELD.MINION_QUORUM]],
  },
  NEW_VANILLA_MINION: {
    required: ['minionName'],
    minionType: MINION_TYPES.VANILLA,
    tx: TX.SUMMON_MINION_VANILLA,
    fields: [[FIELD.MINION_NAME]],
  },
  NEW_SUPERFLUID_MINION: {
    required: ['minionName'],
    minionType: MINION_TYPES.SUPERFLUID,
    tx: TX.SUMMON_MINION_SUPERFLUID,
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
  SELL_NFT_RARIBLE: {
    id: 'SELL_NFT_RARIBLE',
    title: 'Sell NFT on Rarible',
    description: 'Post an NFT for sale on Rarible',
    type: PROPOSAL_TYPES.SELL_NFT_RARIBLE,
    minionType: MINION_TYPES.SAFE,
    tx: TX.SELL_NFT_RARIBLE,
    required: ['selectedMinion', 'orderPrice', 'raribleNftData'],
    fields: [
      [FIELD.NFT_SELECT],
      [
        FIELD.DATE_RANGE,
        {
          ...FIELD.SET_PRICE,
          orderType: 'sell',
        },
        FIELD.RARIBLE_NFT_DATA,
      ],
    ],
  },
  BUY_NFT_RARIBLE: {
    id: 'BUY_NFT_RARIBLE',
    title: 'Buy an NFT on Rarible',
    description:
      'Make a proposal to bid on an NFT on Rarible using a Minion Safe Vault',
    type: PROPOSAL_TYPES.BUY_NFT_RARIBLE,
    minionType: MINION_TYPES.SAFE,
    tx: TX.BUY_NFT_RARIBLE,
    required: [
      'orderPrice',
      'raribleNftData',
      'selectedMinion',
      'targetNft',
      'title',
    ],
    fields: [
      [FIELD.NFT_URI],
      [
        FIELD.MINION_SELECT,
        {
          ...FIELD.DESCRIPTION,
          name: 'nftDescription',
          htmlFor: 'nftDescription',
        },
        {
          ...FIELD.SET_PRICE,
          orderType: 'buy',
        },
        FIELD.RARIBLE_NFT_DATA,
      ],
    ],
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

export const BOOST_FORMS = {
  DISCOURSE_FORUM_COLOR: {
    id: 'DISCOURSE_FORUM_COLOR',
    title: 'Discourse Forum Color',
    required: ['color'],
    fields: [[FIELD.COLOR_PICKER, FIELD.DISCOURSE_META]],
  },
  WRAP_N_ZAP_LAUNCH: {
    id: 'WRAP_N_ZAP_LAUNCH',
    title: 'Deploy Wrap n Zap',
    fields: [[]],
    tx: TX.CREATE_WRAP_N_ZAP,
  },
};
