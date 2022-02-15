import { MINION_TYPES, PROPOSAL_TYPES } from '../../utils/proposalUtils';
import { FIELD } from '../fields';
import { TX } from '../txLegos/contractTX';

export const POSTER_FORMS = {
  RATIFY: {
    id: 'RATIFY',
    dev: true,
    logValues: true,
    title: 'Post a DAO doc',
    description: 'Create a proposal to ratify a DAO document',
    type: PROPOSAL_TYPES.POSTER_RATIFY,
    minionType: MINION_TYPES.SAFE,
    customWidth: '1000px',
    tx: TX.POSTER_RATIFY,
    required: ['title', 'content', 'location'],
    fields: [
      [
        {
          type: 'input',
          label: 'Post Title',
          name: 'title',
          htmlFor: 'title',
          placeholder: 'Post Title',
          expectType: 'any',
        },
        {
          type: 'select',
          name: 'location',
          htmlFor: 'location',
          label: 'Post Location',
          options: [
            // { name: 'Docs', value: 'docs' },
            { name: 'Front Page', value: 'front-page' },
          ],
          placeholder: '--Default: Add to docs--',
        },
        {
          type: 'mdEditor',
          name: 'content',
          htmlFor: 'content',
        },
        {
          type: 'posterStringify',
          name: 'posterData',
        },
        // FIELD.MD_EDITOR,
      ],
    ],
  },
};
