import { FIELD, INFO_TEXT } from './fields';
import { COMMON_STEPS, CONTENT } from './boosts';

const SETTING_STEPS = {
  EDIT_SPAM_FILTER: {
    STEP1: {
      type: 'boostMetaForm',
      form: {
        id: 'SPAM_FILTER',
        title: 'Minimum Tribute',
        required: ['paymentRequested'],
        fields: [
          [
            {
              ...FIELD.PAYMENT_REQUEST,
              label: 'Amount in Deposit Token',
              info: INFO_TEXT.SPAM_FILTER_AMOUNT,
              hideMax: true,
            },
            {
              ...FIELD.BASIC_SWITCH,
              label: 'Spam filter active?',
              name: 'active',
            },
            {
              ...FIELD.PAYMENT_REQUEST,
              label: '<A></A>mount in Deposit Token',
              info: INFO_TEXT.SPAM_FILTER_AMOUNT,
              depositTokenOnly: true,
              hideMax: true,
            },
            {
              ...FIELD.BASIC_SWITCH,
              name: 'membersOnly',
              label: 'Hide new proposal button from non members?',
            },
          ],
        ],
      },
      next: 'STEP2',
      stepLabel: 'Select Filter Parameters',
      isUserStep: true,
      start: true,
    },
    STEP2: { ...COMMON_STEPS.SIGNER, stepLabel: 'Sign', daoRefetch: true },
  },
};

export const BOOST_SETTING = {
  SPAM_FILTER: {
    id: 'SPAM_FILTER',
    steps: SETTING_STEPS.EDIT_SPAM_FILTER,
    boostContent: CONTENT.SPAM_FILTER,
    categories: ['devTools'],
    networks: 'all',
    cost: 'free',
    metaFields: ['paymentRequested', 'paymentToken', 'membersOnly', 'active'],
    settings: { type: 'internalLink', appendToDaoPath: 'settings/spam' },
  },
};
