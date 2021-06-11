// TX = {
//   contract: String
//   poll: String (Optional)(Defaults to name)
//   name: String
//   display: String  (Optional)(Defaults to name)
//   errMsg: String
//   onTxHash: {}Strings
//   successMsg: String
// }

const ACTIONS = {
  PROPOSAL: ['closeProposalModal', 'openTxModal'],
};

export const DETAILS = {
  STANDARD_PROPOSAL: ['title', 'description', 'hash', 'link'],
  MINION_PROPOSAL: [
    'title',
    'description',
    'hash',
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
};
