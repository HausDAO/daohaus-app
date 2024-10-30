import { buildMultiTxAction } from '../../utils/legos';
import { CONTRACTS } from '../contracts';
import { DETAILS } from '../details';

export const HEDGEY_CONTRIBUTOR_REWARDS_BOOST_TX = {
  CONTRIBUTOR_REWARDS_TOKEN: buildMultiTxAction({
    actions: [
      {
        targetContract: '.values.tokenAddress',
        abi: CONTRACTS.ERC_20,
        fnName: 'approve',
        args: [
          '.contextData.chainConfig.hedgey_batch_mint_addr',
          '.values.rewardTotal',
        ],
      },
      {
        targetContract: '.contextData.chainConfig.hedgey_batch_mint_addr',
        abi: CONTRACTS.HEDGEY_BATCH_MINT,
        fnName: 'batchMint',
        args: [
          '.contextData.chainConfig.hedgey_nft_addr',
          '.values.userList',
          '.values.tokenAddress',
          '.values.amountList',
          '.values.dateList',
        ],
      },
    ],
    detailsToJSON: DETAILS.HEDGEY_CONTRIBUTOR_REWARDS_TOKEN,
  }),
};
