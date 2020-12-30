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
      'cancelProposal',
      'proposeAction', // minion
      'executeAction', // minion
    ],
  },
  { name: 'members', methods: ['ragequit', 'ragekick'] },
  {
    name: 'dao',
    methods: [
      'withdrawBalance',
      'withdrawBalances',
      'collectTokens',
      'summonMinion',
    ],
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
  summonMinion: 'Summon Minion',
  summonMoloch: 'Summon Dao',
};

export const POPUP_CONTENT = {
  submitVote: {
    displayName: 'Submit Vote',
    header: 'Your Vote is submitted',
    images: [],
    bodyText: [
      'A proposal will pass with greater than 50% of the vote',
      'After the voting period is finished the proposal can be processed',
      'If you vote yes you can not ragequit until the proposal hase been processed',
    ],
    links: [
      {
        href: 'https://forum.daohaus.club/t/the-life-of-a-proposal/207',
        text: 'Life of a Proposal',
        external: true,
      },
      {
        href: `https://twitter.com/intent/tweet?text=I%20Voted%20https://alpha.daohaus.club`,
        text: 'Share with the world',
        external: true,
      },
    ],
  },
  ragequit: {
    displayName: 'ragequit',
    header: 'Gotta know when to fold em...',
    images: [],
    bodyText: [
      'Your shares/loot are going bye bye',
      'After your tx has completed you can withdraw your balance',
      'Share with twiter and tell the world why',
    ],
    links: [
      {
        href: 'https://forum.daohaus.club/c/help-how-to-docs/12',
        text: 'What is Rage Quit',
        external: true,
      },
      {
        href: 'https://twitter.com/',
        text: 'Share with the world',
        external: true,
      },
    ],
  },
  processProposal: {
    displayName: 'Process Proposal',
    header: 'For the realm...',
    images: [],
    bodyText: [
      'If your dao has a processing reward you can claim it',
      'if not, the dao thanks you for your gas sacrifice',
      'Share with twiter and tell the world you are a dao master',
    ],
    links: [
      {
        href: 'https://forum.daohaus.club/c/help-how-to-docs/12',
        text: 'How proposals work',
        external: true,
      },
      {
        href: 'https://twitter.com/',
        text: 'Share with the world',
        external: true,
      },
    ],
  },
  newDelegateKey: {
    displayName: 'New Delegate Key',
  },
  submitProposalV1: {
    displayName: 'Submit Proposal',
  },
  rageQuit: {
    displayName: 'Rage Quit',
  },
  cancelProposal: {
    displayName: 'Cancel Proposal',
  },
  processGuildKickProposal: {
    displayName: 'Process GuildKick Proposal',
  },
  processWhitelistProposal: {
    displayName: 'Process Whitelist Proposal',
  },
  ragekick: {
    displayName: 'Rage Kick',
  },
  sponsorProposal: {
    displayName: 'Sponsor Proposal',
  },
  submitProposal: {
    displayName: 'Submit Vote',
    header: 'While your proposal is being mined...',
    images: [],
    bodyText: [
      'Your proposal will go into unsponsored state',
      'Share with your friends',
      'What a dude!',
    ],
    links: [
      {
        href: 'https://forum.daohaus.club/c/help-how-to-docs/12',
        text: 'How things work',
        external: true,
      },
      {
        href: 'https://raidguild.org/',
        text: 'What is Rage Quit',
        external: true,
      },
      {
        href: `https://twitter.com/intent/tweet?text=I%20DAO%20https://alpha.daohaus.club`,
        text: 'Share with the world',
        external: true,
      },
    ],
  },
  submitGuildKickProposal: {
    displayName: 'Submit GuildKick Proposal',
  },
  submitWhitelistProposal: {
    displayName: 'Submit Whitelist Proposal',
    header: 'Tokens Tokens Tokens...',
    images: [],
    bodyText: [
      'Your proposal will go into unsponsored state',
      'Tokens need a non zero balance to do direct deposits',
      'Share with your friends',
    ],
    links: [
      {
        href: 'https://forum.daohaus.club/c/help-how-to-docs/12',
        text: 'How things work',
        external: true,
      },
      {
        href: 'https://raidguild.org/',
        text: 'What is Rage Quit',
        external: true,
      },
      {
        href: 'https://twitter.com/',
        text: 'Share with the world',
        external: true,
      },
    ],
  },
  withdrawBalance: {
    displayName: 'Withdraw Balance',
    header: 'MoMo...',
    images: [],
    bodyText: ['Funds should come direct to your wallet'],
    links: [
      {
        href: 'https://twitter.com/',
        text: 'Share with the world',
        external: true,
      },
    ],
  },
  withdrawBalances: {
    displayName: 'Withdraw Balances',
    header: 'MoMoMo...',
    images: [],
    bodyText: ['Funds should come direct to your wallet'],
    links: [
      {
        href: 'https://twitter.com/',
        text: 'Share with the world',
        external: true,
      },
    ],
  },
  collectTokens: {
    displayName: 'Collect Tokens',
    header: 'The Dao is that much richer',
    images: [],
    bodyText: ['But the real winner is the future'],
    links: [
      {
        href: 'https://twitter.com/',
        text: 'Share with the world',
        external: true,
      },
    ],
  },
  propose: {
    displayName: 'Transmutation',
    header: 'Magic',
    images: [],
    bodyText: ['from water into wine'],
    links: [
      {
        href: 'https://twitter.com/',
        text: 'Share with the world',
        external: true,
      },
    ],
  },
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
        (item) => +item.proposalIndex === +tx.details.params[0],
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
