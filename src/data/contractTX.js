// TX = {
//   contract: String
//   poll: String (Optional)(Defaults to name)
//   name: String
//   display: String  (Optional)(Defaults to name)
//   errMsg: String
//   onTxHash: {}Strings
//   successMsg: String
// }

export const ACTIONS = {
  PROPOSAL: ['closeProposalModal', 'openTxModal'],
  BASIC: ['openTxModal'],
};

export const DETAILS = {
  STANDARD_PROPOSAL: ['title', 'description', 'link'],
  MINION_PROPOSAL: [
    'title',
    'description',
    'link',
    'minionType',
    'selectedMinion',
  ],
};

export const TX = {
  SUBMIT_PROPOSAL: {
    contract: 'Moloch',
    name: 'submitProposal',
    onTxHash: ACTIONS.PROPOSAL,
    poll: 'subgraph',
    display: 'Submit Proposal',
    errMsg: 'Error submitting proposal',
    successMsg: 'Funding Proposal submitted!',
    detailsJSON: DETAILS.STANDARD_PROPOSAL,
    argsFromCallback: true,
    createDiscourse: true,
  },
  GUILDKICK_PROPOSAL: {
    contract: 'Moloch',
    name: 'submitGuildKickProposal',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Submit GuildKick Proposal',
    errMsg: 'Error submitting proposal',
    successMsg: 'Guild Kick Proposal submitted!',
    detailsJSON: DETAILS.STANDARD_PROPOSAL,
    createDiscourse: true,
    gatherArgs: ['applicant', 'detailsToJSON'],
  },
  WHITELIST_TOKEN_PROPOSAL: {
    contract: 'Moloch',
    name: 'submitWhitelistProposal',
    poll: 'subgraph',
    onTxHash: ACTIONS.PROPOSAL,
    display: 'Whitelist Token Proposal',
    errMsg: 'Error submitting proposal',
    successMsg: 'Token Proposal submitted!',
    detailsJSON: DETAILS.STANDARD_PROPOSAL,
    createDiscourse: true,
    gatherArgs: ['tokenAddress', 'detailsToJSON'],
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
    detailsJSON: DETAILS.MINION_PROPOSAL,
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
};
