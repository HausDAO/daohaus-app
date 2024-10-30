import { PROPOSAL_TYPES } from '../../utils/proposalUtils';
import { FIELD } from '../fields';
import { TX } from '../txLegos/contractTX';

export const SBT_FORMS = {
  SBT_SUMMON: {
    id: 'SBT_SUMMON',
    dev: true,
    type: PROPOSAL_TYPES.SBT_SUMMON,
    title: 'Summon Soulbound Token',
    description: 'Summon a DAO controlled Soulbound Token',
    tx: TX.SBT_SUMMON,
    required: ['sbtName', 'sbtSymbol', 'selectedMinion'],
    fields: [
      [
        {
          type: 'input',
          label: 'SBT Token Name',
          name: 'sbtName',
          htmlFor: 'sbtName',
          placeholder: 'Token Name',
          expectType: 'any',
        },
        {
          type: 'input',
          label: 'SBT Token Symbol',
          name: 'sbtSymbol',
          htmlFor: 'sbtSymbol',
          placeholder: 'SYMBOL',
          expectType: 'any',
        },
        FIELD.MINION_SELECT,
      ],
    ],
  },
};
