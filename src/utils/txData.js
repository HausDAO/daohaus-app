import { POPUP_CONTENT } from '../content/pending-tx-modal';

export const DISPLAY_NAMES = {
  submitVote: 'Submit Vote',
  ragequit: 'ragequit',
  processProposal: 'Process Proposal',
  newDelegateKey: 'New Delegate Key',
  submitProposalV1: 'Submit Proposal',
  rageQuit: 'Rage Quit',
  cancelProposal: 'Cancel Proposal',
  processGuildKickProposal: 'Process GuildKick Proposal',
  processWhitelistProposal: 'Process Whitelist Proposal',
  ragekick: 'Rage Kick',
  sponsorProposal: 'Sponsor Proposal',
  submitProposal: 'Submit Proposal',
  submitProposalCco: 'CCO Contribution',
  submitGuildKickProposal: 'Submit GuildKick Proposal',
  submitWhitelistProposal: 'Submit Whitelist Proposal',
  withdrawBalance: 'Withdraw Balance',
  withdrawBalances: 'Withdraw Balances',
  collectTokens: 'Collect Tokens',
  summonMinion: 'Summon Minion',
  summonMoloch: 'Summon Dao',
};

const addPopupModalData = tx =>
  tx?.action
    ? {
        ...tx,
        ...POPUP_CONTENT[tx.action],
        displayName: DISPLAY_NAMES[tx.action],
      }
    : null;
export const getLastTx = TXs => {
  return TXs?.length ? addPopupModalData(TXs[0]) : null;
};
