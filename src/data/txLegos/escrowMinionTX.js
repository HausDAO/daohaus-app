import { CONTRACTS } from '../contracts';
import { ACTIONS } from '../onTxHashActions';
import { DETAILS } from '../details';

export const ESCROW_MINION_TX = {
  ESCROW_MINION_CANCEL: {
    contract: CONTRACTS.ESCROW_MINION,
    name: 'cancelAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.BASIC,
    display: 'Cancel Minion',
    errMsg: 'Error Cancelling Minion',
    successMsg: 'Cancelled Minion!',
  },
  OFFER_NFT_TRIBUTE: {
    contract: CONTRACTS.ESCROW_MINION,
    name: 'proposeTribute',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Submitting NFT Tribute Proposal',
    errMsg: 'Error Submitting Proposal',
    successMsg: 'Proposal Submitted',
    gatherArgs: [
      '.contextData.daoid',
      {
        type: 'nestedArgs',
        gatherArgs: ['.values.nftAddress'],
      }, // tokenAddresses
      {
        type: 'nestedArgs',
        gatherArgs: [
          {
            type: 'nestedArgs',
            gatherArgs: [
              '.values.tokenType',
              '.values.tokenId',
              '.values.numTokens || 0',
            ],
          },
        ],
      }, // typesTokensIdsAmounts
      '.values.selectedSafeAddress', // vaultAddress (Minion Address?)
      {
        type: 'nestedArgs',
        gatherArgs: [
          '.values.sharesRequested',
          '.values.lootRequested',
          '.values.paymentRequested', // Funds
        ],
      }, // tokenAddresses
      {
        type: 'detailsToJSON',
        gatherFields: DETAILS.OFFER_NFT_TRIBUTE,
      },
    ],
  },
  WITHDRAW_ESCROW: {
    contract: CONTRACTS.ESCROW_MINION,
    name: 'withdrawToDestination',
    poll: 'subgraph',
    onTxHash: ACTIONS.BASIC,
    display: 'Withdraw Balance from Escrow',
    errMsg: 'Error Withdrawing Balance from Escrow',
    successMsg: 'Balance Withdrawn from Escrow!',
  },
};
