// TX = {
//   contract: String
//   poll: String (Optional)(Defaults to name)
//   name: String
//   display: String  (Optional)(Defaults to name)
//   errMsg: String
//   onTxHash: {}Strings
//   successMsg: String
// }

import { MINION_TYPES } from '../utils/proposalUtils';

export const ACTIONS = {
  PROPOSAL: ['closeProposalModal', 'openTxModal'],
  BASIC: ['openTxModal'],
  GENERIC_MODAL: ['closeGenericModal', 'openTxModal'],
};

export const DETAILS = {
  STANDARD_PROPOSAL: {
    title: '.values.title',
    description: '.values.description',
    link: '.values.link.',
    proposalType: '.formData.type',
  },
  VANILLA_MINION_PROPOSAL: {
    title: '.values.title',
    description: '.values.description',
    proposalType: '.formData.type',
    minionType: MINION_TYPES.VANILLA,
  },
  PAYROLL_PROPOSAL: {
    title: '{minionName} sends a token',
    description:
      '{minionName} would like to send {tokenAmount} {tokenSymbol} to {recipient}',
    proposalType: '.formData.type',
    minionType: MINION_TYPES.VANILLA,
  },
  PAYROLL_PROPOSAL_TEMPORARY: {
    title: 'Minion sends a token',
    description: 'Click check details to see more.',
    proposalType: '.formData.type',
    minionType: MINION_TYPES.VANILLA,
  },
};

export const TX = {
  SUBMIT_PROPOSAL: {
    contract: 'Moloch',
    name: 'submitProposal',
    onTxHash: ACTIONS.PROPOSAL,
    poll: 'subgraph',
    display: 'Submit Proposal',
    errMsg: 'Error submitting proposal',
    successMsg: 'Proposal submitted!',
    gatherArgs: [
      '.values.applicant || .contextData.address',
      '.values.sharesRequested || 0',
      '.values.lootRequested || 0',
      '.values.tributeOffered || 0',
      '.values.tributeToken || .contextData.daoOverview.depositToken.tokenAddress',
      '.values.paymentRequested || 0',
      '.values.paymentToken || .contextData.daoOverview.depositToken.tokenAddress',
      { type: 'detailsToJSON', gatherFields: DETAILS.STANDARD_PROPOSAL },
    ],
    createDiscourse: true,
  },
  LOOT_GRAB_PROPOSAL: {
    contract: 'Moloch',
    name: 'submitProposal',
    onTxHash: ACTIONS.PROPOSAL,
    poll: 'subgraph',
    display: 'Submit Loot Grab Proposal',
    errMsg: 'Error submitting proposal',
    successMsg: 'Loot Grab submitted!',
    gatherArgs: [
      '.contextData.address',
      0,
      '.values.lootRequested',
      '.values.tributeOffered',
      '.values.tributeToken',
      0,
      '.contextData.daoOverview.depositToken.tokenAddress',
      JSON.stringify({
        title: 'Loot Grab Proposal',
        description: 'Trade Tokens for Loot',
      }),
    ],
  },
  GUILDKICK_PROPOSAL: {
    contract: 'Moloch',
    name: 'submitGuildKickProposal',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Submit GuildKick Proposal',
    errMsg: 'Error submitting proposal',
    successMsg: 'Guild Kick Proposal submitted!',
    createDiscourse: true,
    gatherArgs: [
      '.values.applicant',
      { type: 'detailsToJSON', gatherFields: DETAILS.STANDARD_PROPOSAL },
    ],
  },
  WHITELIST_TOKEN_PROPOSAL: {
    contract: 'Moloch',
    name: 'submitWhitelistProposal',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Whitelist Token Proposal',
    errMsg: 'Error submitting proposal',
    successMsg: 'Token Proposal submitted!',
    createDiscourse: true,
    gatherArgs: [
      '.values.tokenAddress',
      { type: 'detailsToJSON', gatherFields: DETAILS.STANDARD_PROPOSAL },
    ],
  },
  UNLOCK_TOKEN: {
    contract: 'Token',
    name: 'approve',
    specialPoll: 'unlockToken',
    onTxHash: null,
    display: 'Approve Spend Token',
    errMsg: 'Approve Token Failed',
    successMsg: 'Approved Token!',
  },
  MINION_PROPOSE_ACTION: {
    contract: 'Minion',
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Propose Minion Action',
    errMsg: 'Error submitting action to minion',
    successMsg: 'Minion Proposal Created!',
    argsFromCallback: true,
    createDiscourse: true,
  },
  CANCEL_PROPOSAL: {
    contract: 'Moloch',
    name: 'cancelProposal',
    poll: 'subgraph',
    onTxHash: ACTIONS.BASIC,
    display: 'Cancel Proposal',
    errMsg: 'Error cancelling proposal',
    successMsg: 'Proposal Cancelled!',
  },
  SPONSOR_PROPOSAL: {
    contract: 'Moloch',
    name: 'sponsorProposal',
    poll: 'subgraph',
    onTxHash: ACTIONS.BASIC,
    display: 'Sponsor Proposal',
    errMsg: 'Error sponsoring proposal',
    successMsg: 'Proposal Sponsored!',
  },
  SUBMIT_VOTE: {
    contract: 'Moloch',
    name: 'submitVote',
    poll: 'subgraph',
    onTxHash: ACTIONS.BASIC,
    display: 'Submit Vote',
    errMsg: 'Error Submitting Vote',
    successMsg: 'Vote Submitted!',
  },
  PROCESS_PROPOSAL: {
    contract: 'Moloch',
    name: 'processProposal',
    poll: 'subgraph',
    onTxHash: ACTIONS.BASIC,
    display: 'Process Proposal',
    errMsg: 'Error Processing Proposal',
    successMsg: 'Proposal Processed!',
  },
  PROCESS_GK_PROPOSAL: {
    contract: 'Moloch',
    name: 'processGuildKickProposal',
    poll: 'subgraph',
    onTxHash: ACTIONS.BASIC,
    display: 'Process Proposal',
    errMsg: 'Error Processing Proposal',
    successMsg: 'Proposal Processed!',
  },
  PROCESS_WL_PROPOSAL: {
    contract: 'Moloch',
    name: 'processWhitelistProposal',
    poll: 'subgraph',
    onTxHash: ACTIONS.BASIC,
    display: 'Process Proposal',
    errMsg: 'Error Processing Proposal',
    successMsg: 'Proposal Processed!',
  },
  COLLECT_TOKENS: {
    contract: 'Moloch',
    name: 'collectTokens',
    poll: 'subgraph',
    onTxHash: ACTIONS.BASIC,
    display: 'Sync Token Balances',
    errMsg: 'Error Syncing Token Balances',
    successMsg: 'Token Balances Synced!',
  },
  UPDATE_DELEGATE: {
    contract: 'Moloch',
    name: 'updateDelegateKey',
    poll: 'subgraph',
    onTxHash: ACTIONS.GENERIC_MODAL,
    display: 'Update Delegate Key',
    errMsg: 'Error Updating Delegate Key',
    successMsg: 'Delegate Key Updated!',
    gatherArgs: ['.values.delegateAddress'],
  },
  WITHDRAW: {
    contract: 'Moloch',
    name: 'withdrawBalance',
    poll: 'subgraph',
    onTxHash: ACTIONS.BASIC,
    display: 'Withdraw Balance',
    errMsg: 'Error Withdrawing Balance',
    successMsg: 'Balance Withdrawn!',
  },
  RAGE_QUIT: {
    contract: 'Moloch',
    name: 'ragequit',
    poll: 'subgraph',
    onTxHash: ACTIONS.GENERIC_MODAL,
    display: 'Rage Quit',
    errMsg: 'Error Rage Quitting',
    successMsg: 'Rage quit processed!',
  },
  PAYROLL: {
    contract: 'Minion',
    name: 'proposeAction',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Sending Token',
    errMsg: 'Error Submitting Proposal',
    successMsg: 'Proposal Submitted!',
    gatherArgs: [
      '.values.minionToken',
      0,
      {
        type: 'encodeHex',
        location: 'local',
        abiName: 'ERC_20',
        fnName: 'transfer',
        gatherArgs: ['.values.applicant', '.values.minionPayment'],
      },
      {
        type: 'detailsToJSON',
        gatherFields: DETAILS.PAYROLL_PROPOSAL_TEMPORARY,
      },
    ],
  },
};
