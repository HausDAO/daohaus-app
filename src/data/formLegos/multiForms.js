import { MINION_TYPES } from '../../utils/proposalUtils';
import { PROPOSAL_FORMS } from '../forms';
import { TX } from '../txLegos/contractTX';

export const MULTI_FORMS = {
  SAFE_TX_BUILDER: {
    id: 'SAFE_TX_BUILDER',
    logValues: true,
    isTxBuilder: true,
    type: 'multiForm',
    minionType: MINION_TYPES.SAFE,
    tx: TX.GENERIC_SAFE_MULTICALL,
    title: 'Safe Minion TX Builder',
    description: 'Create a multi-transaction proposal',
    footer: 'end',
    collapse: 'all',
    customWidth: `900px`,
    forms: [
      PROPOSAL_FORMS.START_SAFE_MULTI,
      PROPOSAL_FORMS.CREATE_TX,
      PROPOSAL_FORMS.MULTICALL_CONFIRMATION,
    ],
  },
};
