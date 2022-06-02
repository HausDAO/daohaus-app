import { MINION_TYPES, PROPOSAL_TYPES } from '../../utils/proposalUtils';
import { FIELD } from '../fields';
import { TX } from '../txLegos/contractTX';

const POSTER_DESCRIPTION = {
  ...FIELD.DESCRIPTION,
  name: 'posterData.description',
};

export const POSTER_FORMS = {
  POST_IPFS_MD: {
    id: 'POST_IPFS_MD',
    dev: true,
    title: 'Publish New Document',
    description:
      'Create and post a Markdown document to IPFS using the Pinata API',
    tx: TX.POSTER_IPFS_MD,
    customWidth: '1000px',
    required: ['posterData.title', 'posterData.content'],
    fields: [[FIELD.POST_TITLE, POSTER_DESCRIPTION, FIELD.MD_EDITOR]],
  },
  RATIFY_MD: {
    id: 'RATIFY_MD',
    dev: true,
    title: 'Publish & Ratify Document',
    description:
      'Create a Markdown document on IPFS and propose document for ratification by the DAO',
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
    title: 'Ratify Existing Document',
    description: 'Propose an existing document for ratification by the DAO',
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
      ],
    ],
    additionalOptions: [
      POSTER_DESCRIPTION,
      { ...FIELD.TITLE, label: 'Proposal Title' },
    ],
  },
  POST_LOCATION: {
    id: 'POST_LOCATION',
    dev: true,
    title: 'Configure Document Location',
    description:
      'Propose & edit where Ratified documents are shown in the DAO’s page',
    customWidth: '500px',
    required: ['docSelect', 'posterData.location'],
    tx: TX.POST_LOCATION,
    fields: [[FIELD.DOC_SELECT, FIELD.POST_LOCATION_SELECT]],
    additionalOptions: [
      POSTER_DESCRIPTION,
      { ...FIELD.TITLE, label: 'Proposal Title' },
    ],
  },
};
