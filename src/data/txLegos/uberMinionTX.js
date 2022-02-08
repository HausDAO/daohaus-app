import { CONTRACTS } from '../contracts';
import { ACTIONS } from '../onTxHashActions';

export const UBER_MINION_TX = {
  UBER_EXECUTE_ACTION: {
    contract: CONTRACTS.UBERHAUS_MINION,
    name: 'executeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.GENERIC_MODAL,
    display: 'Executing Minion Proposal',
    errMsg: 'Error Executing Minion Proposal',
    successMsg: 'Minion Proposal Executed!',
  },
  APPROVE_UHMINION_HAUS: {
    contract: CONTRACTS.UBERHAUS_MINION,
    name: 'approveUberHaus',
    poll: 'subgraph',
    onTxHash: ACTIONS.GENERIC_MODAL,
    display: 'Approving HAUS',
    errMsg: 'Error Approving HAUS',
    successMsg: "Approved Minion's HAUS",
  },
  UBERHAUS_MINION_EXECUTE_APPOINTMENT: {
    contract: CONTRACTS.UBERHAUS_MINION,
    name: 'executeAppointment',
    specialPoll: 'executeAction',
    onTxHash: ACTIONS.GENERIC_MODAL,
    display: 'Executing Minion Proposal',
    errMsg: 'Error Executing Minion Proposal',
    successMsg: 'Minion Proposal Executed!',
  },
};
