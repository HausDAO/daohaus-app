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
        FIELD.LINK,
        FIELD.SHARES_REQUEST,
        FIELD.LOOT_REQUEST,
        FIELD.PAYMENT_REQUEST,
      ],
    ],
  },
};
