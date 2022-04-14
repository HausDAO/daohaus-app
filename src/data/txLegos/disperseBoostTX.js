import { buildMultiTxAction } from '../../utils/legos';
import { CONTRACTS } from '../contracts';
import { DETAILS } from '../details';

export const DISPERSE_BOOST_TX = {
  DISPERSE_TOKEN: buildMultiTxAction({
    actions: [
      {
        targetContract: '.values.tokenAddress', // required
        abi: CONTRACTS.ERC_20, // required
        fnName: 'approve', // required
        args: [
          '.contextData.chainConfig.disperse_app',
          '.values.disperseTotal',
        ], // required
        // logTX:true
      },
      {
        targetContract: '.contextData.chainConfig.disperse_app',
        abi: CONTRACTS.DISPERSE_APP,
        fnName: 'disperseTokenSimple',
        args: [
          '.values.tokenAddress',
          '.values.userList',
          '.values.amountList',
        ],
      },
    ],
    detailsToJSON: DETAILS.DISPERSE_TOKEN,
  }),
  DISPERSE_ETH: buildMultiTxAction({
    actions: [
      {
        targetContract: '.contextData.chainConfig.disperse_app',
        abi: CONTRACTS.DISPERSE_APP,
        fnName: 'disperseEther',
        args: ['.values.userList', '.values.amountList'],
        value: '.values.disperseTotal',
      },
    ],
    detailsToJSON: DETAILS.DISPERSE_ETH,
  }),
};
