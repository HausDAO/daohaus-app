import { buildMultiTxAction } from '../../utils/legos';
import { CONTRACTS } from '../contracts';
import { DETAILS } from '../details';

export const MILLION_TX = {
  SUMMON_TOKEN: buildMultiTxAction({
    actions: [
      {
        targetContract: '.contextData.chainConfig.erc20_summon',
        abi: CONTRACTS.ERC_20_SUMMON,
        fnName: 'summonToken',
        args: [
          '1000000000000000000000000',
          '.values.tokenName',
          '.values.tokenSymbol',
          '.values.selectedSafeAddress',
        ],
      },
    ],
    detailsToJSON: DETAILS.MILLION,
  }),
};
