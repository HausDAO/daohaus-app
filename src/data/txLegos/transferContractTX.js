import { CONTRACTS } from '../contracts';
import { DETAILS } from '../details';
import { ACTIONS } from '../onTxHashActions';

export const VAULT_TRANSFER_TX = {
  MINION_SEND_ERC20_TOKEN: {
    contract: CONTRACTS.LOCAL_VANILLA_MINION,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Transferring Tokens',
    errMsg: 'Error Submitting Proposal',
    successMsg: 'Proposal Submitted!',
    gatherArgs: [
      '.localValues.tokenAddress',
      0,
      {
        type: 'encodeHex',
        contract: CONTRACTS.LOCAL_ERC_20,
        fnName: 'transfer',
        gatherArgs: ['.values.applicant', '.values.minionPayment'],
      },
      {
        type: 'detailsToJSON',
        gatherFields: DETAILS.PAYROLL_PROPOSAL,
      },
    ],
  },
  MINION_SEND_ERC20_TOKEN_NIFTY: {
    contract: CONTRACTS.LOCAL_NIFTY_MINION,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Transferring Tokens',
    errMsg: 'Error Submitting Proposal',
    successMsg: 'Proposal Submitted!',
    gatherArgs: [
      '.localValues.tokenAddress',
      0,
      {
        type: 'encodeHex',
        contract: CONTRACTS.LOCAL_ERC_20,
        fnName: 'transfer',
        gatherArgs: ['.values.applicant', '.values.minionPayment'],
      },
      {
        type: 'detailsToJSON',
        gatherFields: DETAILS.PAYROLL_PROPOSAL,
      },
      '.contextData.daoOverview.depositToken.tokenAddress',
      0,
    ],
  },
  MINION_SEND_ERC20_TOKEN_SAFE: {
    contract: CONTRACTS.LOCAL_SAFE_MINION,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Transferring Tokens',
    errMsg: 'Error Submitting Proposal',
    successMsg: 'Proposal Submitted!',
    gatherArgs: [
      {
        // _transactions,
        type: 'encodeSafeActions',
        contract: CONTRACTS.LOCAL_SAFE_MULTISEND,
        fnName: 'multiSend',
        to: [
          {
            type: 'nestedArgs',
            gatherArgs: ['.localValues.tokenAddress'],
          },
        ],
        value: [
          {
            type: 'nestedArgs',
            gatherArgs: ['0'],
          },
        ],
        data: [
          {
            type: 'nestedArgs',
            gatherArgs: [
              {
                type: 'encodeHex',
                contract: CONTRACTS.LOCAL_ERC_20,
                fnName: 'transfer',
                gatherArgs: ['.values.applicant', '.values.minionPayment'],
              },
            ],
          },
        ],
        operation: [
          {
            type: 'nestedArgs',
            gatherArgs: ['0'],
          },
        ],
      },
      '.contextData.daoOverview.depositToken.tokenAddress', // _withdrawToken
      0, // _withdrawAmount
      {
        // _details
        type: 'detailsToJSON',
        gatherFields: DETAILS.PAYROLL_PROPOSAL,
      },
      true, // _memberOnlyEnabled
    ],
  },
  MINION_SEND_NETWORK_TOKEN: {
    contract: CONTRACTS.LOCAL_VANILLA_MINION,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Transferring Tokens',
    errMsg: 'Error Submitting Proposal',
    successMsg: 'Proposal Submitted!',
    gatherArgs: [
      '.values.applicant',
      '.values.minionPayment',
      '.localValues.tokenAddress',
      {
        type: 'detailsToJSON',
        gatherFields: DETAILS.PAYROLL_PROPOSAL,
      },
    ],
  },
  MINION_SEND_NETWORK_TOKEN_NIFTY: {
    contract: CONTRACTS.LOCAL_NIFTY_MINION,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Transferring Tokens',
    errMsg: 'Error Submitting Proposal',
    successMsg: 'Proposal Submitted!',
    gatherArgs: [
      '.values.applicant',
      '.values.minionPayment',
      '.localValues.tokenAddress',
      {
        type: 'detailsToJSON',
        gatherFields: DETAILS.MINION_ETH_TRANSFER,
      },
      '.contextData.daoOverview.depositToken.tokenAddress',
      0,
    ],
  },
  MINION_SEND_NETWORK_TOKEN_SAFE: {
    contract: CONTRACTS.LOCAL_SAFE_MINION,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Transferring Tokens',
    errMsg: 'Error Submitting Proposal',
    successMsg: 'Proposal Submitted!',
    gatherArgs: [
      {
        // _transactions,
        type: 'encodeSafeActions',
        contract: CONTRACTS.LOCAL_SAFE_MULTISEND,
        fnName: 'multiSend',
        to: [
          {
            type: 'nestedArgs',
            gatherArgs: ['.values.applicant'],
          },
        ],
        value: [
          {
            type: 'nestedArgs',
            gatherArgs: ['.values.minionPayment'],
          },
        ],
        data: [
          {
            type: 'nestedArgs',
            gatherArgs: ['0x'],
          },
        ],
        operation: [
          {
            type: 'nestedArgs',
            gatherArgs: ['0'],
          },
        ],
      },
      '.contextData.daoOverview.depositToken.tokenAddress', // _withdrawToken
      0, // _withdrawAmount
      {
        // _details
        type: 'detailsToJSON',
        gatherFields: DETAILS.PAYROLL_PROPOSAL,
      },
      true, // _memberOnlyEnabled
    ],
  },
  MINION_SEND_ERC721_TOKEN: {
    contract: CONTRACTS.LOCAL_VANILLA_MINION,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Transferring NFT',
    errMsg: 'Error Submitting Proposal',
    successMsg: 'Proposal Submitted!',
    gatherArgs: [
      '.values.nftAddress',
      0,
      {
        type: 'encodeHex',
        contract: CONTRACTS.LOCAL_ERC_721,
        fnName: 'safeTransferFrom',
        gatherArgs: [
          '.values.minionAddress',
          '.values.applicant',
          '.values.tokenId',
        ],
      },
      {
        type: 'detailsToJSON',
        gatherFields: DETAILS.MINION_NFT_TRANSFER,
      },
    ],
  },
  MINION_SEND_ERC721_TOKEN_NIFTY: {
    contract: CONTRACTS.LOCAL_NIFTY_MINION,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Transferring NFT',
    errMsg: 'Error Submitting Proposal',
    successMsg: 'Proposal Submitted!',
    gatherArgs: [
      '.values.nftAddress',
      0,
      {
        type: 'encodeHex',
        contract: CONTRACTS.LOCAL_ERC_721,
        fnName: 'safeTransferFrom',
        gatherArgs: [
          '.values.minionAddress',
          '.values.applicant',
          '.values.tokenId',
        ],
      },
      {
        type: 'detailsToJSON',
        gatherFields: DETAILS.MINION_NFT_TRANSFER,
      },
      '.contextData.daoOverview.depositToken.tokenAddress',
      0,
    ],
  },
  MINION_SEND_ERC721_TOKEN_SAFE: {
    contract: CONTRACTS.LOCAL_SAFE_MINION,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Transferring NFT',
    errMsg: 'Error Submitting Proposal',
    successMsg: 'Proposal Submitted!',
    gatherArgs: [
      {
        // _transactions,
        type: 'encodeSafeActions',
        contract: CONTRACTS.LOCAL_SAFE_MULTISEND,
        fnName: 'multiSend',
        to: [
          {
            type: 'nestedArgs',
            gatherArgs: ['.values.nftAddress'],
          },
        ],
        value: [
          {
            type: 'nestedArgs',
            gatherArgs: ['0'],
          },
        ],
        data: [
          {
            type: 'nestedArgs',
            gatherArgs: [
              {
                type: 'encodeHex',
                contract: CONTRACTS.LOCAL_ERC_721,
                fnName: 'safeTransferFrom',
                gatherArgs: [
                  '.localValues.safeAddress',
                  '.values.applicant',
                  '.values.tokenId',
                ],
              },
            ],
          },
        ],
        operation: [
          {
            type: 'nestedArgs',
            gatherArgs: ['0'],
          },
        ],
      },
      '.contextData.daoOverview.depositToken.tokenAddress', // _withdrawToken
      0, // _withdrawAmount
      {
        // _details
        type: 'detailsToJSON',
        gatherFields: DETAILS.MINION_NFT_TRANSFER,
      },
      true, // _memberOnlyEnabled
    ],
  },
  MINION_SEND_ERC1155_TOKEN_SAFE: {
    contract: CONTRACTS.LOCAL_SAFE_MINION,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Transferring NFT',
    errMsg: 'Error Submitting Proposal',
    successMsg: 'Proposal Submitted!',
    gatherArgs: [
      {
        // _transactions,
        type: 'encodeSafeActions',
        contract: CONTRACTS.LOCAL_SAFE_MULTISEND,
        fnName: 'multiSend',
        to: [
          {
            type: 'nestedArgs',
            gatherArgs: ['.values.nftAddress'],
          },
        ],
        value: [
          {
            type: 'nestedArgs',
            gatherArgs: ['0'],
          },
        ],
        data: [
          {
            type: 'nestedArgs',
            gatherArgs: [
              {
                type: 'encodeHex',
                contract: CONTRACTS.LOCAL_ERC_1155,
                fnName: 'safeTransferFrom',
                gatherArgs: [
                  '.localValues.safeAddress',
                  '.values.applicant',
                  '.values.tokenId',
                  '.values.tokenBalance',
                  '0x',
                ],
              },
            ],
          },
        ],
        operation: [
          {
            type: 'nestedArgs',
            gatherArgs: ['0'],
          },
        ],
      },
      '.contextData.daoOverview.depositToken.tokenAddress', // _withdrawToken
      0, // _withdrawAmount
      {
        // _details
        type: 'detailsToJSON',
        gatherFields: DETAILS.MINION_NFT_TRANSFER,
      },
      true, // _memberOnlyEnabled
    ],
  },
  //   MINION_SEND_ERC1155_TOKEN_NIFTY: {
  //     contract: CONTRACTS.LOCAL_NIFTY_MINION,
  //     name: 'proposeAction',
  //     poll: 'subgraph',
  //     onTxHash: ACTIONS.PROPOSAL,
  //     display: 'Transferring NFT',
  //     errMsg: 'Error Submitting Proposal',
  //     successMsg: 'Proposal Submitted!',
  //     gatherArgs: [
  //       '.values.nftAddress',
  //       0,
  //       {
  //         type: 'encodeHex',
  //         contract: CONTRACTS.LOCAL_ERC_1155,
  //         fnName: 'safeTransferFrom',
  //         gatherArgs: [
  //           '.values.minionAddress',
  //           '.values.applicant',
  //           '.values.tokenId',
  //           '.values.tokenBalance',
  //           '',
  //         ],
  //       },
  //       {
  //         type: 'detailsToJSON',
  //         gatherFields: DETAILS.MINION_NFT_TRANSFER,
  //       },
  //       '.contextData.daoOverview.depositToken.tokenAddress',
  //       0,
  //     ],
  //   },
};
