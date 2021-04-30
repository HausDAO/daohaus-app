import { PROPOSAL_TYPES } from '../utils/proposalUtils';

export const PROPOSAL_FORMS = {
  MEMBER: {
    type: PROPOSAL_TYPES.MEMBER,
    tx: {
      poll: 'submitProposal',
      service: 'moloch',
      action: 'submitProposal',
    },
    fields: [
      {
        type: 'input',
        label: 'Title',
        name: 'title',
        htmlFor: 'title',
        placeholder: 'Proposal Title',
      },
      {
        type: 'textarea',
        label: 'Description',
        name: 'description',
        htmlFor: 'description',
        placeholder: 'How does that make you feel, champ',
      },
      {
        type: 'linkInput',
        label: 'Link',
        name: 'link',
        htmlFor: 'link',
        placeholder: 'daolink.club',
      },
    ],
  },
};
