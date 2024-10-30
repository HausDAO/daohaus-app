import { MINION_TYPES, PROPOSAL_TYPES } from '../../utils/proposalUtils';
import { FIELD } from '../fields';
import { TX } from '../txLegos/contractTX';

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
  PROFILE: {
    id: 'PROFILE',
    title: 'Update Basic Profile',
    description:
      'Editing this profile will update your profile everywhere Ceramic is used',
    tx: null,
    ctaText: 'Connect',
    blurText: 'Connect to update your profile',
    fields: [
      [
        FIELD.AVATAR,
        {
          ...FIELD.TITLE,
          label: 'Name',
          name: 'name',
          placeholder: 'A name for your profile',
          htmlFor: 'name',
          expectType: 'string',
          maxLength: {
            value: 150,
            message: 'Name must be less than 150 characters',
          },
        },
        {
          ...FIELD.DESCRIPTION,
          label: 'Bio',
          name: 'description',
          htmlFor: 'description',
          placeholder: 'A description about yourself',
          expectType: 'string',
          maxLength: {
            value: 420,
            message: 'Bio must be less than 420 characters',
          },
        },
      ],
      [
        {
          ...FIELD.TITLE,
          label: 'Spirit Emoji',
          name: 'emoji',
          placeholder: 'An emoji to represent who you are',
          htmlFor: 'emoji',
          expectType: 'string',
          maxLength: { value: 2, message: 'Not a valid emoji' },
        },

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
          maxLength: {
            value: 140,
            message: 'Location must be less than 420 characters',
          },
        },
      ],
    ],
    additionalOptions: [],
    customValidations: [],
  },
};
