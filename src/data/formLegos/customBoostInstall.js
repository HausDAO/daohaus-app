import { MINION_TYPES, PROPOSAL_TYPES } from '../../utils/proposalUtils';
import { FIELD, INFO_TEXT } from '../fields';
import { TX } from '../txLegos/contractTX';

export const CUSTOM_BOOST_INSTALL_FORMS = {
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
  SNAPSHOT: {
    id: 'SNAPSHOT',
    title: 'Show Snapshot Proposals',
    subtitle:
      'View your community&apos;s snapshot proposals directly within DAOhaus for easy access.',
    required: ['space'],
    fields: [
      {
        ...FIELD.TITLE,
        label: 'Snapshot Space',
        name: 'space',
      },
    ],
    indicatorStates: {
      loading: {
        spinner: true,
        title: 'Submitting...',
        explorerLink: true,
      },
      error: {
        // FOR KEATING, can we remove anthing that is not static data?
        // icon: BiErrorCircle,
        title:
          "Error: No space found! Please use the .eth name in your space's url",
        errorMessage: true,
      },
    },
    stepValidation: 'validateSnapshot',
  },
  SPAM_FILTER: {
    id: 'SPAM_FILTER',
    title: 'Minimum Tribute',
    required: ['paymentRequested'],
    fields: [
      [
        {
          ...FIELD.PAYMENT_REQUEST,
          label: 'Amount in Deposit Token',
          info: INFO_TEXT.SPAM_FILTER_AMOUNT,
          depositTokenOnly: true,
          hideMax: true,
        },
        {
          ...FIELD.BASIC_SWITCH,
          name: 'membersOnly',
          label: 'Hide new proposal button from non members?',
        },
      ],
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
      'tokenType',
      'selectedMinion',
      'nftApproval',
      'sharesRequested',
      'lootRequested',
      'paymentRequested',
    ],
    fields: [
      [
        { ...FIELD.MINION_SELECT, info: INFO_TEXT.TRIBUTE_MINION },
        { ...FIELD.NFT_SELECT, source: 'user' },
      ],
      [
        FIELD.TITLE,
        FIELD.DESCRIPTION,
        FIELD.SHARES_REQUEST,
        FIELD.LOOT_REQUEST,
        FIELD.PAYMENT_REQUEST,
      ],
    ],
  },
  CROSSCHAIN_MINION: {
    id: 'CROSSCHAIN_MINION',
    title: 'Deploy a Cross-chain Minion Safe',
    tx: TX.SUMMON_MINION_AND_SAFE,
    required: [
      '_minionName',
      'foreignChainId',
      'foreignSafeAddress',
      'minQuorum',
      'saltNonce',
    ],
    fields: [
      [
        {
          ...FIELD.MINION_NAME,
          name: '_minionName',
          htmlFor: '_minionName',
        },
        {
          ...FIELD.PRECOMPUTED_MINION_NAME,
          hidden: true,
        },
        FIELD.MINION_QUORUM,
        FIELD.SALT_NONCE,
        FIELD.FOREIGN_CHAIN_SELECT,
        {
          ...FIELD.ONLY_SAFE,
          info: INFO_TEXT.FOREIGN_SAFE_ADDRESS,
          label: 'Existing Gnosis Safe Address',
          name: 'foreignSafeAddress',
          htmlFor: 'foreignSafeAddress',
          foreignChain: true,
        },
      ],
    ],
    customValidations: ['validMinionName'],
  },
  ZODIAC_CROSSCHAIN_MODULE: {
    id: 'ZODIAC_CROSSCHAIN_MODULE',
    title: 'Add Zodiac Bridge on Gnosis Safe on a Foreign Chain',
    required: ['foreignChainId', 'foreignSafeAddress'],
    fields: [
      [
        {
          ...FIELD.FOREIGN_CHAIN_SELECT,
          disabled: true,
          label: 'Foreign Chain',
        },
        {
          ...FIELD.ONLY_SAFE,
          disabled: true,
          info: INFO_TEXT.FOREIGN_SAFE_ADDRESS,
          label: 'Gnosis Safe Address',
          name: 'foreignSafeAddress',
          htmlFor: 'foreignSafeAddress',
          foreignChain: true,
        },
        {
          ...FIELD.SWITCH_NETWORK,
          warningMessage:
            'IMPORTANT: You Must be a Gnosis Safe Signer on the Foreign Chain',
        },
        {
          ...FIELD.PROPOSAL_NAME,
          name: 'zodiacAction',
          htmlFor: 'zodiacAction',
          hidden: true,
        },
      ],
    ],
  },
  MOLOCH_TOKEN_LAUNCH: {
    id: 'MOLOCH_TOKEN_LAUNCH',
    title: 'Deploy Moloch Token',
    fields: [[FIELD.TOKEN_NAME, FIELD.TOKEN_SYMBOL]],
    required: ['token_name', 'token_symbol'],
    tx: TX.CREATE_MOLOCH_TOKEN,
  },
};
