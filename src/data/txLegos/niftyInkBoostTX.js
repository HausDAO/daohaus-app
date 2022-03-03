import { CONTRACTS } from '../contracts';
import { DETAILS } from '../details';
import { ACTIONS } from '../onTxHashActions';

export const NIFTYINK_BOOST_TX = {
  MINION_BUY_NIFTY_INK: {
    contract: CONTRACTS.SELECTED_MINION_NIFTY,
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Buy NiftyInk',
    errMsg: 'Error Submitting Proposal',
    successMsg: 'Proposal Submitted!',
    gatherArgs: [
      '0xcf964c89f509a8c0ac36391c5460df94b91daba5',
      '.values.paymentRequested',
      {
        type: 'encodeHex',
        contract: CONTRACTS.NIFTY_INK,
        fnName: 'buyInk',
        gatherArgs: ['.values.ipfsHash'],
      },
      {
        type: 'detailsToJSON',
        gatherFields: DETAILS.MINION_BUY_NIFTY,
      },
      '.values.paymentToken',
      '.values.paymentRequested',
    ],
  },
};
