import { CONTRACTS } from '../contracts';
import { ACTIONS } from '../onTxHashActions';
import { DETAILS } from '../details';

export const SUPERFLUID_MINION_TX = {
  SUMMON_MINION_SUPERFLUID: {
    contract: CONTRACTS.SUPERFLUID_MINION_FACTORY,
    name: 'summonMinion',
    poll: 'subgraph',
    display: 'Summoning Minion',
    errMsg: 'Error Summoning Minion',
    successMsg: 'Minion Summoned!',
    gatherArgs: [
      '.contextData.daoid',
      '.contextData.chainConfig.superfluid.superapp_addr.v1',
      '.values.minionName',
    ],
  },
  SUPERFLUID_MINION_EXECUTE: {
    contract: CONTRACTS.SUPERFLUID_MINION_LOCAL,
    name: 'executeAction',
    specialPoll: 'executeAction',
    onTxHash: ACTIONS.GENERIC_MODAL,
    display: 'Executing Minion Proposal',
    errMsg: 'Error Executing Minion Proposal',
    successMsg: 'Minion Proposal Executed!',
  },
  SUPERFLUID_STREAM: {
    contract: CONTRACTS.SUPERFLUID_MINION_SELECT,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Submitting Stream Proposal',
    errMsg: 'Error Submitting Proposals',
    successMsg: 'Proposal Submitted',
    gatherArgs: [
      '.values.applicant',
      '.values.paymentToken',
      '.values.weiRatePerSec',
      '.values.paymentRequested',
      '0x0',
      {
        type: 'detailsToJSON',
        gatherFields: DETAILS.STANDARD_PROPOSAL,
      },
    ],
  },
  SUPERFLUID_CREATE_SUPERTOKEN: {
    contract: CONTRACTS.SUPERTOKEN_FACTORY,
    name: 'createERC20Wrapper',
    specialPoll: 'superTokenCreated',
    onTxHash: ACTIONS.BASIC,
    display: 'Giving a Token Superporwers',
    errMsg: 'Error Creating Supertoken',
    successMsg: 'Supertoken Created Successfully',
  },
  SAFE_SUPERFLUID_NATIVE_UPGRADE_N_STREAM: {
    contract: CONTRACTS.SELECTED_MINION_SAFE,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Submitting Stream Proposal',
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
              '.values.superTokenAddress',
              '.contextData.chainConfig.superfluid.host',
            ],
          },
        ],
        value: [
          {
            type: 'nestedArgs',
            gatherArgs: [
              '0',
              '.values.paymentRequested', // minDeposit
              '0',
            ],
          },
        ],
        data: [
          {
            type: 'nestedArgs',
            gatherArgs: [
              {
                type: 'encodeHex',
                contract: CONTRACTS.NATIVE_WRAPPER,
                fnName: 'withdraw',
                gatherArgs: [
                  '.values.paymentRequested', // unwrap minDeposit
                ],
              },
              {
                type: 'encodeHex',
                contract: CONTRACTS.SUPERFLUID_SETH,
                fnName: 'upgradeByETH',
                gatherArgs: [],
              },
              {
                type: 'nestedArgs',
                contract: CONTRACTS.SUPERFLUID_HOST,
                fnName: 'callAgreement',
                gatherArgs: [
                  '.contextData.chainConfig.superfluid.cfa',
                  {
                    type: 'encodeHex',
                    contract: CONTRACTS.SUPERFLUID_CFA,
                    fnName: 'createFlow',
                    gatherArgs: [
                      '.values.superTokenAddress',
                      '.values.applicant',
                      '.values.weiRatePerSec',
                      '0x', // TODO: new bytes(0) // placeholder
                    ],
                  },
                  '0x',
                ],
              },
            ],
          },
        ],
        operation: [
          {
            type: 'nestedArgs',
            gatherArgs: ['0', '0', '0'],
          },
        ],
      },
      '.values.paymentToken', // _withdrawToken
      '.values.paymentRequested', // _withdrawAmount
      {
        type: 'detailsToJSON',
        gatherFields: DETAILS.SUPERFLUID_STREAM,
      },
      true, // _memberOnlyEnabled
    ],
  },
  SAFE_SUPERFLUID_UPGRADE_N_STREAM: {
    contract: CONTRACTS.SELECTED_MINION_SAFE,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Submitting Stream Proposal',
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
              '.values.superTokenAddress',
              '.contextData.chainConfig.superfluid.host',
            ],
          },
        ],
        value: [
          {
            type: 'nestedArgs',
            gatherArgs: ['0', '0', '0'],
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
                  '.values.superTokenAddress',
                  '.values.allowanceToApply',
                ],
              },
              {
                type: 'encodeHex',
                contract: CONTRACTS.SUPERTOKEN,
                fnName: 'upgrade',
                gatherArgs: [
                  '.values.paymentRequested', // minDeposit
                ],
              },
              {
                type: 'nestedArgs',
                contract: CONTRACTS.SUPERFLUID_HOST,
                fnName: 'callAgreement',
                gatherArgs: [
                  '.contextData.chainConfig.superfluid.cfa',
                  {
                    type: 'encodeHex',
                    contract: CONTRACTS.SUPERFLUID_CFA,
                    fnName: 'createFlow',
                    gatherArgs: [
                      '.values.superTokenAddress',
                      '.values.applicant',
                      '.values.weiRatePerSec',
                      '0x', // TODO: new bytes(0) // placeholder
                    ],
                  },
                  '0x',
                ],
              },
            ],
          },
        ],
        operation: [
          {
            type: 'nestedArgs',
            gatherArgs: ['0', '0', '0'],
          },
        ],
      },
      '.values.paymentToken', // _withdrawToken
      '.values.paymentRequested', // _withdrawAmount
      {
        type: 'detailsToJSON',
        gatherFields: DETAILS.SUPERFLUID_STREAM,
      },
      true, // _memberOnlyEnabled
    ],
  },
  SAFE_SUPERFLUID_STREAM: {
    contract: CONTRACTS.SELECTED_MINION_SAFE,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Submitting Stream Proposal',
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
            gatherArgs: ['.contextData.chainConfig.superfluid.host'],
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
                type: 'nestedArgs',
                contract: CONTRACTS.SUPERFLUID_HOST,
                fnName: 'callAgreement',
                gatherArgs: [
                  '.contextData.chainConfig.superfluid.cfa',
                  {
                    type: 'encodeHex',
                    contract: CONTRACTS.SUPERFLUID_CFA,
                    fnName: 'createFlow',
                    gatherArgs: [
                      '.values.paymentToken',
                      '.values.applicant',
                      '.values.weiRatePerSec',
                      '0x',
                    ],
                  },
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
      '.values.paymentToken', // _withdrawToken
      '.values.paymentRequested', // _withdrawAmount
      {
        type: 'detailsToJSON',
        gatherFields: DETAILS.SUPERFLUID_STREAM,
      },
      true, // _memberOnlyEnabled
    ],
  },
  SAFE_CANCEL_SUPERFLUID_STREAM: {
    contract: CONTRACTS.SELECTED_MINION_SAFE,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Submitting Cancel Stream Proposal',
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
            gatherArgs: ['.contextData.chainConfig.superfluid.host'],
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
                type: 'nestedArgs',
                contract: CONTRACTS.SUPERFLUID_HOST,
                fnName: 'callAgreement',
                gatherArgs: [
                  '.contextData.chainConfig.superfluid.cfa',
                  {
                    type: 'encodeHex',
                    contract: CONTRACTS.SUPERFLUID_CFA,
                    fnName: 'deleteFlow',
                    gatherArgs: [
                      '.localValues.superTokenAddress',
                      '.localValues.senderAddress',
                      '.localValues.receiverAddress',
                      '0x',
                    ],
                  },
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
      '0', // _withdrawAmount
      {
        type: 'detailsToJSON',
        gatherFields: DETAILS.SUPERFLUID_CANCEL_STREAM,
      },
      true, // _memberOnlyEnabled
    ],
  },
  SAFE_SUPERFLUID_UPGRADE_TOKEN: {
    contract: CONTRACTS.SELECTED_MINION_SAFE,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Submitting Superfluid Token Upgrade Proposal',
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
            gatherArgs: ['.values.paymentToken', '.values.superTokenAddress'],
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
                  '.values.superTokenAddress',
                  '.values.allowanceToApply',
                ],
              },
              {
                type: 'encodeHex',
                contract: CONTRACTS.SUPERTOKEN,
                fnName: 'upgrade',
                gatherArgs: [
                  '.values.paymentRequested', // minDeposit
                ],
              },
            ],
          },
        ],
        operation: [
          {
            type: 'nestedArgs',
            gatherArgs: ['0', '0'],
          },
        ],
      },
      '.values.paymentToken', // _withdrawToken
      '.values.paymentRequested', // _withdrawAmount
      {
        type: 'detailsToJSON',
        gatherFields: DETAILS.STANDARD_PROPOSAL,
      },
      true, // _memberOnlyEnabled
    ],
  },
  MINION_DOWNGRADE_RETURN_TOKEN_SAFE: {
    contract: CONTRACTS.LOCAL_SAFE_MINION,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Downgrade & Return Tokens',
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
            gatherArgs: ['.values.superTokenAddress', '.values.tokenAddress'],
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
                contract: CONTRACTS.SUPERTOKEN,
                fnName: 'downgrade',
                gatherArgs: ['.localValues.downgradeValue'],
              },
              {
                type: 'encodeHex',
                contract: CONTRACTS.LOCAL_ERC_20,
                fnName: 'transfer', // TODO: should use safeTranfer on compatible ABI
                gatherArgs: [
                  '.contextData.daoOverview.id',
                  '.localValues.minionTransfer',
                ],
              },
            ],
          },
        ],
        operation: [
          {
            type: 'nestedArgs',
            gatherArgs: ['0', '0'],
          },
        ],
      },
      '.contextData.daoOverview.depositToken.tokenAddress', // _withdrawToken
      '0', // _withdrawAmount
      {
        // _details
        type: 'detailsToJSON',
        gatherFields: DETAILS.SUPERFLUID_DOWNGRADE_SUPERTOKEN,
      },
      true, // _memberOnlyEnabled
    ],
  },
};
