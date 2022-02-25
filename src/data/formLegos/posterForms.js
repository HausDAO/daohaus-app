import { MINION_TYPES, PROPOSAL_TYPES } from '../../utils/proposalUtils';
import { FIELD } from '../fields';
import { TX } from '../txLegos/contractTX';

const POSTER_DESCRIPTION = {
  ...FIELD.DESCRIPTION,
  name: 'posterData.description',
};

export const POSTER_FORMS = {
  RATIFY_MD: {
    id: 'RATIFY_MD',
    dev: true,
    title: 'Ratify Markdown',
    description: 'Create a proposal to ratify markdown',
    type: PROPOSAL_TYPES.POSTER_RATIFY,
    minionType: MINION_TYPES.SAFE,
    customWidth: '1000px',
    tx: TX.POSTER_RATIFY,
    required: ['posterData.title', 'posterData.content', 'selectedMinion'],
    fields: [
      [
        FIELD.MINION_SELECT,
        FIELD.POST_TITLE,
        FIELD.POST_LOCATION_SELECT,
        FIELD.MD_EDITOR,
        FIELD.POSTER_ENCODER,
      ],
    ],
    additionalOptions: [POSTER_DESCRIPTION],
  },
  RATIFY_DAO_DOC: {
    id: 'RATIFY_DAO_DOC',
    dev: true,
    logValues: true,
    title: 'Ratify DAO Document',
    description: 'Create a proposal to ratify an existing DAO Doc',
    type: PROPOSAL_TYPES.POSTER_RATIFY,
    minionType: MINION_TYPES.SAFE,
    tx: TX.POSTER_RATIFY_DOC,
    required: ['selectedMinion', 'docSelect'],
    fields: [
      [
        FIELD.MINION_SELECT,
        FIELD.DOC_SELECT,
        {
          ...FIELD.POST_LOCATION_SELECT,
          label: 'New Location',
          placeholder: '--Same Location--',
          name: 'newLocation',
        },
        // FIELD.POSTER_ENCODER,
      ],
    ],
    additionalOptions: [
      POSTER_DESCRIPTION,
      { ...FIELD.TITLE, label: 'Proposal Title' },
    ],
  },
  POST_IPFS_MD: {
    id: 'POST_IPFS_MD',
    dev: true,
    title: 'Post Markdown to IPFS',
    description: 'Post Markdown to IPFS using the Pinata API',
    tx: TX.POSTER_IPFS_MD,
    customWidth: '1000px',
    required: ['posterData.title', 'posterData.content'],
    fields: [[FIELD.POST_TITLE, POSTER_DESCRIPTION, FIELD.MD_EDITOR]],
  },
  POST_MD: {
    id: 'POST_MD',
    dev: true,
    title: 'Post markdown to chain',
    description: 'Publish MD on chain and assign to Docs',
    tx: TX.POSTER_MD,
    customWidth: '1000px',
    required: ['posterData.title', 'posterData.content'],
    fields: [
      [
        FIELD.POST_TITLE,
        POSTER_DESCRIPTION,
        FIELD.MD_EDITOR,
        FIELD.POSTER_ENCODER,
      ],
    ],
  },
};
