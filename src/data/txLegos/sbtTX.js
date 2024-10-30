import { buildMultiTxAction } from '../../utils/legos';
import { CONTRACTS } from '../contracts';
import { DETAILS } from '../details';

export const SBT_TX = {
  SBT_SUMMON: buildMultiTxAction({
    actions: [
      {
        targetContract: '.contextData.chainConfig.sbt_factory',
        abi: CONTRACTS.SBT_FACTORY,
        fnName: 'summonSBT',
        args: [
          '.values.sbtName',
          '.values.sbtSymbol',
          '.values.selectedMinion',
          {
            type: 'detailsToJSON',
            gatherFields: DETAILS.SBT_SUMMON,
          },
        ],
      },
    ],
    detailsToJSON: DETAILS.SBT_SUMMON,
  }),
};
