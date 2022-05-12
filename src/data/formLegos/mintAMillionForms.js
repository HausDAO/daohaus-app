import { MINION_TYPES, PROPOSAL_TYPES } from '../../utils/proposalUtils';
import { FIELD } from '../fields';
import { TX } from '../txLegos/contractTX';

export const MILLION_FORMS = {
  SUMMON_TOKEN: {
    id: 'SUMMON_TOKEN',
    title: 'Mint A Million',
    description: 'Mint a million of a new token!',
    type: PROPOSAL_TYPES.MINT_A_MILLION,
    minionType: MINION_TYPES.SAFE,
    dev: true,
    logValues: true,
    tx: TX.SUMMON_TOKEN,
    required: ['tokenName', 'tokenSymbol', 'selectedMinion'],
    fields: [
      [
        FIELD.MINION_SELECT,
        {
          type: 'input',
          label: 'Token Name',
          name: 'tokenName',
          htmlFor: 'tokenName',
          placeholder: 'Token name',
          expectType: 'any',
        },
        {
          type: 'input',
          label: 'Token Symbol',
          name: 'tokenSymbol',
          htmlFor: 'tokenSymbol',
          placeholder: 'Token Symbol',
          expectType: 'any',
        },
      ],
    ],
  },
};
