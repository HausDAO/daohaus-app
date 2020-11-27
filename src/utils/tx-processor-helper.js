export const TX_CONTEXTS = [
  {
    name: 'proposals',
    methods: [
      'sponsorProposal',
      'processGuildKickProposal',
      'processWhitelistProposal',
      'processProposal',
      'submitVote',
      'submitWhiteListProposal',
      'submitGuildKickProposal',
      'submitProposal',
      'cancelProposal',
    ],
  },
  { name: 'members', methods: ['rageQuit', 'ragekick'] },
  {
    name: 'dao',
    methods: ['withdrawBalance', 'withdrawBalances', 'collectTokens'],
  },
];

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
  submitGuildKickProposal: 'Submit GuildKick Proposal',
  submitWhitelistProposal: 'Submit Whitelist Proposal',
  withdrawBalance: 'Withdraw Balance',
  withdrawBalances: 'Withdraw Balances',
  collectTokens: 'Collect Tokens',
};

export const txIsUpdated = (tx, entities) => {
  let status = '';
  switch (tx.details.name) {
    case 'sponsorProposal': {
      const entity = entities.find(
        (item) => +item.proposalId === +tx.details.params[0],
      );
      status = entity?.sponsored;
      break;
    }
    case 'processGuildKickProposal':
    case 'processWhitelistProposal':
    case 'processProposal': {
      const entity = entities.find(
        (item) => +item.proposalIndex === +tx.details.params[0],
      );
      status = entity?.processed;
      break;
    }
    case 'submitVote': {
      const entity = entities.find(
        (item) => +item.proposalId === +tx.details.params[0],
      );
      status = entity?.votes.find(
        (vote) =>
          vote.memberAddress.toLowerCase() === tx.details.from.toLowerCase(),
      );
      break;
    }
    case 'submitWhiteListProposal':
    case 'submitGuildKickProposal':
    case 'submitProposal': {
      const entity = entities.find((item) =>
        tx.details.params[7].indexOf(item.hash),
      );
      console.log('entity', entity);
      console.log('tx.details.params[7]', tx.details.params[7]);
      status = entity || null;
      break;
    }
    case 'cancelProposal': {
      const entity = entities.find(
        (item) => +item.proposalId === +tx.details.params[0],
      );
      status = entity?.cancelled;
      break;
    }
    case 'rageQuit': {
      break;
    }
    case 'ragekick': {
      break;
    }
    case 'withdrawBalance': {
      break;
    }
    case 'withdrawBalances': {
      break;
    }
    case 'collectTokens': {
      break;
    }
    default: {
      break;
    }
  }
  return status;
};
