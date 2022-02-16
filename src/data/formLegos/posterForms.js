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
    required: ['posterData.title', 'posterData.content'],
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
      FIELD.LINK,
      { ...FIELD.TITLE, label: 'Proposal Title' },
    ],
  },
};
