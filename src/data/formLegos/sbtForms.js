import { MINION_TYPES, PROPOSAL_TYPES } from '../../utils/proposalUtils';
import { FIELD } from '../fields';
import { TX } from '../txLegos/contractTX';

export const SBT_FORMS = {
  SBT_SUMMON: {
    id: 'SBT_SUMMON',
    type: PROPOSAL_TYPES.SBT_SUMMON,
    minionType: MINION_TYPES.SAFE,
    dev: true,
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
        {
          type: 'goofyCustomField',
          label: 'Goofy Custom Field',
          name: 'goofy',
          htmlFor: 'goofy',
          placeholder: 'Goofy',
          expectType: 'any',
        },

        FIELD.MINION_SELECT,
      ],
    ],
  },
  // SBT_MINT: {
  //   id: 'SBT_MINT',
  //   type: PROPOSAL_TYPES.SBT_SUMMON,
  //   minionType: MINION_TYPES.SAFE,
  //   title: 'Mint Soulbound Token',
  //   description: 'Summon a DAO controlled Soulbound Token',
  //   tx: TX.SBT_SUMMON,
  //   required: ['sbtName', 'sbtSymbol', 'selectedMinion'],
  //   fields: [
  //     [
  //       {
  //         type: 'input',
  //         label: 'SBT Token Name',
  //         name: 'sbtName',
  //         htmlFor: 'sbtName',
  //         placeholder: 'Token Name',
  //         expectType: 'any',
  //       },
  //       {
  //         type: 'input',
  //         label: 'SBT Token Symbol',
  //         name: 'sbtSymbol',
  //         htmlFor: 'sbtSymbol',
  //         placeholder: 'SYMBOL',
  //         expectType: 'any',
  //       },
  //       FIELD.MINION_SELECT,
  //     ],
  //   ],
  // },
};
