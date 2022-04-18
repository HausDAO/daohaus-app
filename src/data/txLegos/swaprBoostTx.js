import { buildMultiTxAction } from '../../utils/legos';
import { CONTRACTS } from '../contracts';
import { DETAILS } from '../details';

export const SWAPR_BOOST_TX = {
  SWAPR_STAKE: buildMultiTxAction({
    actions: [
      {
        targetContract: '.values.stakingTokenAddress', // required
        abi: CONTRACTS.ERC_20, // required
        fnName: 'approve', // required
        args: ['.contextData.chainConfig.swapr.staking', '.values.tokenAmt'], // required
      },
      {
        targetContract: '.contextData.chainConfig.swapr.staking',
        abi: CONTRACTS.SWAPR_STAKING,
        fnName: 'stake',
        args: ['.values.tokenAmt'],
      },
    ],
    detailsToJSON: DETAILS.STANDARD_PROPOSAL,
  }),
};
