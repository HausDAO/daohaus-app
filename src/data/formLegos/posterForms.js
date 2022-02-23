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
        {
          type: 'input',
          label: 'Post Title',
          name: 'posterData.title',
          htmlFor: 'posterData.title',
          placeholder: 'Post Title',
          expectType: 'any',
        },
        {
          type: 'select',
          name: 'posterData.location',
          htmlFor: 'posterData.location',
          label: 'Post Location',
          options: [
            { name: 'Docs', value: 'docs' },
            { name: 'Front Page', value: 'front-page' },
          ],
        },
        {
          type: 'mdEditor',
          name: 'posterData.content',
          htmlFor: 'posterData.content',
        },
        {
          type: 'posterStringify',
          name: 'posterData',
        },
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
        {
          type: 'input',
          label: 'Post Title',
          name: 'posterData.title',
          htmlFor: 'posterData.title',
          placeholder: 'Post Title',
          expectType: 'any',
        },
        FIELD.DESCRIPTION,
        {
          type: 'mdEditor',
          name: 'posterData.content',
          htmlFor: 'posterData.content',
        },
      ],
    ],
    // additionalOptions: [{ ...FIELD.TITLE, label: 'Proposal Title' }],
  },
};
