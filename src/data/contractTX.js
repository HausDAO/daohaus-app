// TX = {
//   contract: String
//   pollName: String (Optional)(Defaults to name)
//   name: String
//   display: String  (Optional)(Defaults to name)
//   errMsg: String
//   onTXHash: {}Strings
//   successMsg: String
// }

const ON_TX = {
  PROPOSAL: ['closeProposalModal', 'openTxInfoModal'],
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
    onTXHash: ON_TX.PROPOSAL,
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
    pollName: 'submitProposal',
    onTXHash: ON_TX.PROPOSAL,
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
    onTXHash: ON_TX.PROPOSAL,
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
    pollName: 'unlockToken',
    onTXHash: null,
    display: 'Approve Spend Token',
    errMsg: 'Approve Token Failed',
    successMsg: 'Approved Token!',
  },
  MINION_PROPOSE_ACTION: {
    contract: 'Minion',
    name: 'proposeAction',
    pollName: 'minionProposeAction',
    onTXHash: ON_TX.PROPOSAL,
    display: 'Propose Minion Action',
    errMsg: 'Error submitting action to minion',
    successMsg: 'Minion Proposal Created!',
    argsFromCallback: true,
    createDiscourse: true,
    detailsJSON: DETAILS.MINION_PROPOSAL,
  },
};
