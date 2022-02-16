import { MINION_TYPES, PROPOSAL_TYPES } from '../../utils/proposalUtils';

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
    // tx: TX.POSTER_RATIFY,
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
  },
};
