import { ACTIONS, CONTRACTS, DETAILS } from './contractTX';

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
        gatherFields: DETAILS.PAYROLL_PROPOSAL,
      },
      '.contextData.daoOverview.depositToken.tokenAddress',
      0,
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
  //   MINION_SEND_ERC1155_TOKEN: {
  //     contract: CONTRACTS.LOCAL_VANILLA_MINION,
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
  //     ],
  //   },
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

export const TEST_TX = {
  MINION_SEND_ERC20_TOKEN_SAFE: {
    contract: CONTRACTS.LOCAL_NEAPOLITAN_MINION,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Transferring Tokens',
    errMsg: 'Error Submitting Proposal',
    successMsg: 'Proposal Submitted!',
    gatherArgs: [
      {
        type: 'encodeSafeActions',
        tos: {
          type: 'nestedArgs',
          gatherArgs: ['.localValues.tokenAddress'],
        },
        values: {
          type: 'nestedArgs',
          gatherArgs: ['0'],
        },
        datas: {
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
        operations: {
          type: 'nestedArgs',
          gatherArgs: ['0'],
        },
      },
      '.contextData.daoOverview.depositToken.tokenAddress',
      0,
      {
        type: 'detailsToJSON',
        gatherFields: DETAILS.PAYROLL_PROPOSAL,
      },
      'true',
    ],
  },
};
