import { MINION_TYPES, PROPOSAL_TYPES } from '../../utils/proposalUtils';
import { FIELD } from '../fields';
import { TX } from '../txLegos/contractTX';

export const POSTER_FORMS = {
  RATIFY: {
    id: 'RATIFY',
    dev: true,
    title: 'Post a DAO doc',
    description: 'Create a proposal to ratify a DAO document',
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
    additionalOptions: [
      FIELD.DESCRIPTION,
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
    fields: [
      [
        FIELD.POST_TITLE,
        { ...FIELD.DESCRIPTION, name: 'posterData.description' },
        FIELD.MD_EDITOR,
      ],
    ],
    // additionalOptions: [{ ...FIELD.TITLE, label: 'Proposal Title' }],
  },
};
