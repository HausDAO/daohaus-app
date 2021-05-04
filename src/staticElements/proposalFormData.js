import { PROPOSAL_TYPES } from '../utils/proposalUtils';

export const FIELD_TYPES = {
  TITLE: {
    type: 'input',
    label: 'Title',
    name: 'title',
    htmlFor: 'title',
    placeholder: 'Proposal Title',
  },
  DESCRIPTION: {
    type: 'textarea',
    label: 'Description',
    name: 'description',
    htmlFor: 'description',
    placeholder: 'How does that make you feel, champ',
  },
  SHARES_REQUEST: {
    type: 'input',
    label: 'shares requested',
    name: 'shares',
    htmlFor: 'shares',
    placeholder: '0',
  },
  LINK: {
    type: 'linkInput',
    label: 'Link',
    name: 'link',
    htmlFor: 'link',
    placeholder: 'daolink.club',
  },
};

export const PROPOSAL_FORMS = {
  MEMBER: {
    type: PROPOSAL_TYPES.MEMBER,
    tx: {
      poll: 'submitProposal',
      service: 'moloch',
      action: 'submitProposal',
    },
    fields: [
      FIELD_TYPES.TITLE,
      FIELD_TYPES.SHARES_REQUEST,
      FIELD_TYPES.DESCRIPTION,
      {
        type: 'inputSelect',
        selectLabel: 'Tests',
        label: 'Sample Input Select',
        name: 'generic-input-select',
        htmlFor: 'generic-input-select',
        options: [
          { name: 'Test 1', value: 'test 1' },
          { name: 'Test 2', value: 'test 2' },
          { name: 'Test 3', value: 'test 3' },
        ],
      },
      FIELD_TYPES.LINK,
    ],
    additionalOptions: [FIELD_TYPES.TITLE, FIELD_TYPES.SHARES_REQUEST],
  },
};
