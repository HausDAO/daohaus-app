import { CONTRACTS } from '../contracts';

export const TOKEN_TX = {
  UNLOCK_TOKEN: {
    contract: CONTRACTS.ERC_20,
    name: 'approve',
    specialPoll: 'unlockToken',
    onTxHash: null,
    display: 'Approve Spend Token',
    errMsg: 'Approve Token Failed',
    successMsg: 'Approved Token!',
  },
  UNLOCK_NFTS: {
    contract: CONTRACTS.LOCAL_ERC_721,
    name: 'setApprovalForAll',
    specialPoll: 'approveAllTokens',
    onTxHash: null,
    display: 'Approve All Tokens',
    errMsg: 'Approve Tokens Failed',
    successMsg: 'Approved Tokens!',
  },
};
