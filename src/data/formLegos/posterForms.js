import { MINION_TYPES, PROPOSAL_TYPES } from '../../utils/proposalUtils';
import { FIELD } from '../fields';

export const POSTER_FORMS = {
  RATIFY: {
    id: 'RATIFY',
    dev: true,
    title: 'Post a DAO doc',
    description: 'Create a proposal to ratify a DAO document',
    type: PROPOSAL_TYPES.POSTER_RATIFY,
    minionType: MINION_TYPES.SAFE,
    // tx:
    required: ['title', 'content', 'location'],
    fields: [[FIELD.TITLE, FIELD.POST_LOCATION, FIELD.MD_EDITOR]],
  },
};
