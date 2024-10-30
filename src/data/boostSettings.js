import { merge } from 'lodash';
import { FIELD, INFO_TEXT } from './fields';
import { FORM } from './formLegos/forms';
import { COMMON_STEPS, CONTENT } from './boosts';

const SETTING_STEPS = {
  EDIT_SPAM_FILTER: {
    STEP1: {
      type: 'boostMetaForm',
      form: {
        ...FORM.SPAM_FILTER,
        fields: [
          merge(
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
            ],
            FORM.SPAM_FILTER.fields,
          ),
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
