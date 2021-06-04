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

export const TX = {
  SUBMIT_PROPOSAL: {
    contract: 'Moloch',
    name: 'submitProposal',
    onTXHash: ON_TX.PROPOSAL,
    display: 'Submit Proposal',
    errMsg: 'Error submitting proposal',
    successMsg: 'Funding Proposal submitted!',
  },
  GUILDKICK_PROPOSAL: {
    contract: 'Moloch',
    name: 'submitGuildKickProposal',
    onTXHash: ON_TX.PROPOSAL,
    pollName: 'submitProposal',
    display: 'Submit GuildKick Proposal',
    errMsg: 'Error submitting proposal',
    successMsg: 'Guild Kick Proposal submitted!',
  },
  WHITELIST_TOKEN_PROPOSAL: {
    contract: 'Moloch',
    name: 'submitWhitelistProposal',
    onTXHash: ON_TX.PROPOSAL,
    display: 'Whitelist Token Proposal',
    errMsg: 'Error submitting proposal',
    successMsg: 'Token Proposal submitted!',
  },
  MINION_PROPOSE_ACTION: {
    contract: 'Minion',
    name: 'proposeAction',
    pollName: 'minionProposeAction',
    onTXHash: ON_TX.PROPOSAL,
    display: 'Propose Minion Action',
    errMsg: 'Error submitting action to minion',
    successMsg: 'Minion Proposal Created!',
  },
};
