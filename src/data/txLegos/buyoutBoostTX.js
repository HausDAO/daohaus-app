import { CONTRACTS } from '../contracts';
import { DETAILS } from '../details';
import { ACTIONS } from '../onTxHashActions';

export const BUYOUT_BOOST_TX = {
  SET_BUYOUT_TOKEN: {
    contract: CONTRACTS.SELECTED_MINION_SAFE,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Submitting Buyout Proposal',
    errMsg: 'Error Submitting Buyout Proposal',
    successMsg: 'Buyout Proposal Submitted',
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
              '.contextData.chainConfig.dao_conditional_helper_addr',
              '.values.paymentToken',
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
            type: 'encodeHex',
            contract: CONTRACTS.DAO_CONDITIONAL_HELPER,
            fnName: 'isNotDaoMember',
            gatherArgs: ['.contextData.address', '.contextData.daoid'],
          },
          {
            type: 'encodeHex',
            contract: CONTRACTS.PAYMENT_ERC_20,
            fnName: 'transfer',
            gatherArgs: ['.contextData.address', '.values.paymentRequested'],
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
        gatherFields: DETAILS.SET_BUYOUT_TOKEN,
      },
      true, // _memberOnlyEnabled
    ],
  },
};
