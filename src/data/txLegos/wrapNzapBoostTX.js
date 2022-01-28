import { CONTRACTS } from '../contracts';
import { ACTIONS } from '../onTxHashActions';

export const WRAPNZAP_BOOST_TX = {
  CREATE_WRAP_N_ZAP: {
    contract: CONTRACTS.WRAP_N_ZAP_FACTORY,
    name: 'create',
    poll: 'boostSubgraph',
    display: 'Create Wrap-N-Zap',
    errMsg: 'Error creating Wrap-N-Zap',
    successMsg: 'Wrap-N-Zap added!',
    gatherArgs: [
      '.contextData.daoid',
      '.contextData.chainConfig.wrapper_contract',
    ],
  },
  POKE_WRAP_N_ZAP: {
    contract: CONTRACTS.WRAP_N_ZAP,
    name: 'poke',
    onTxHash: ACTIONS.GENERIC_MODAL,
    specialPoll: 'pollWrapNZap',
    display: 'Poke Wrap-N-Zap',
    errMsg: 'Error poking Wrap-N-Zap',
    successMsg: 'Wrap-N-Zap Poke Successful!',
  },
};
