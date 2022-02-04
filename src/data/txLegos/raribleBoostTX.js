import { CONTRACTS } from '../contracts';
import { DETAILS } from '../details';
import { ACTIONS } from '../onTxHashActions';

export const RARIBLE_BOOST = {
  SELL_NFT_RARIBLE: {
    contract: CONTRACTS.SELECTED_MINION_SAFE,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Submitting NFT Sale Proposal',
    errMsg: 'Error Submitting Proposals',
    successMsg: 'Proposal Submitted',
    gatherArgs: [
      {
        // _transactions,
        type: 'encodeSafeActions',
        contract: CONTRACTS.LOCAL_SAFE_MULTISEND,
        fnName: 'multiSend',
        to: [
          {
            type: 'nestedArgs',
            gatherArgs: [
              '.values.nftAddress',
              '.contextData.chainConfig.safeMinion.safe_sign_lib_addr',
            ],
          },
        ],
        value: [
          {
            type: 'nestedArgs',
            gatherArgs: ['0', '0'],
          },
        ],
        data: [
          {
            type: 'nestedArgs',
            gatherArgs: [
              {
                type: 'encodeHex',
                contract: CONTRACTS.ERC_721,
                fnName: 'setApprovalForAll',
                gatherArgs: [
                  '.contextData.chainConfig.rarible.nft_transfer_proxy',
                  'true',
                ],
              },
              {
                type: 'encodeHex',
                contract: CONTRACTS.LOCAL_SAFE_SIGNLIB,
                fnName: 'signMessage',
                gatherArgs: ['.values.eip712HashValue'],
              },
            ],
          },
        ],
        operation: [
          {
            type: 'nestedArgs',
            gatherArgs: ['0', '1'],
          },
        ],
      },
      '.contextData.daoOverview.depositToken.tokenAddress', // _withdrawToken
      0, // _withdrawAmount
      {
        type: 'detailsToJSON',
        gatherFields: DETAILS.SELL_NFT_RARIBLE,
      },
      true, // _memberOnlyEnabled
    ],
  },
  BUY_NFT_RARIBLE: {
    contract: CONTRACTS.SELECTED_MINION_SAFE,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Submitting NFT Buy Proposal',
    errMsg: 'Error Submitting Proposals',
    successMsg: 'Proposal Submitted',
    gatherArgs: [
      {
        // _transactions,
        type: 'encodeSafeActions',
        contract: CONTRACTS.LOCAL_SAFE_MULTISEND,
        fnName: 'multiSend',
        to: [
          {
            type: 'nestedArgs',
            gatherArgs: [
              '.values.paymentToken',
              '.contextData.chainConfig.safeMinion.safe_sign_lib_addr',
            ],
          },
        ],
        value: [
          {
            type: 'nestedArgs',
            gatherArgs: ['0', '0'],
          },
        ],
        data: [
          {
            type: 'nestedArgs',
            gatherArgs: [
              {
                type: 'encodeHex',
                contract: CONTRACTS.ERC_20,
                fnName: 'approve',
                gatherArgs: [
                  '.contextData.chainConfig.rarible.erc20_transfer_proxy',
                  '.values.totalOrderPrice',
                ],
              },
              {
                type: 'encodeHex',
                contract: CONTRACTS.LOCAL_SAFE_SIGNLIB,
                fnName: 'signMessage',
                gatherArgs: ['.values.eip712HashValue'],
              },
            ],
          },
        ],
        operation: [
          {
            type: 'nestedArgs',
            gatherArgs: ['0', '1'],
          },
        ],
      },
      '.values.paymentToken', // _withdrawToken
      '.values.totalOrderPrice', // _withdrawAmount
      {
        type: 'detailsToJSON',
        gatherFields: DETAILS.BUY_NFT_RARIBLE,
      },
      true, // _memberOnlyEnabled
    ],
  },
};
