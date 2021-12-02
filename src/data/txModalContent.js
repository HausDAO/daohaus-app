export const POPUP_CONTENT = {
  submitVote: {
    displayName: 'Submit Vote',
    header: 'Next Steps',
    images: [],
    bodyText: [
      'A proposal will pass if there are more votes for "yes" (👍️) than "no" (👎️).',
      'There is no minumum quorum (number of votes).',
      'After a proposal passes, there is a short grace period before the proposal can be processed.',
      'If you voted "yes" (👍️), you can not ragequit until the proposal has been processed',
    ],
    links: [
      {
        href: 'https://forum.daohaus.club/t/the-life-of-a-proposal/207',
        text: 'Life of a Proposal',
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
    ],
  },
  processProposal: {
    displayName: 'Process Proposal',
    header: 'For the realm...',
    images: [],
    bodyText: [
      'If this DAO has a processing reward you can claim it in your profile',
    ],
    links: [
      {
        href: 'https://forum.daohaus.club/c/help-how-to-docs/12',
        text: 'How proposals work',
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
    header: 'Next Steps',
    images: [],
    bodyText: [
      'Your proposal is ready to sponsor',
      'A member has to sponsor your proposal',
    ],
    links: [
      {
        href: 'https://forum.daohaus.club/c/help-how-to-docs/12',
        text: 'The Life of a Proposal',
        external: true,
      },
    ],
  },
  submitGuildKickProposal: {
    displayName: 'Submit GuildKick Proposal',
  },
  submitWhitelistProposal: {
    displayName: 'Submit Whitelist Proposal',
    header: 'Next Steps',
    images: [],
    bodyText: [
      'Your proposal is ready to sponsor',
      'Tokens need a non zero balance to do direct deposits',
    ],
    links: [],
  },
  withdrawBalance: {
    displayName: 'Withdraw Balance',
    header: 'Next Steps',
    images: [],
    bodyText: ['Tokens go to your wallet'],
    links: [],
  },
  withdrawBalances: {
    displayName: 'Withdraw Balances',
    header: 'Next Steps',
    images: [],
    bodyText: ['Funds should come direct to your wallet'],
    links: [],
  },
  collectTokens: {
    displayName: 'Collect Tokens',
    header: 'The Dao is that much richer',
    images: [],
    bodyText: ['But the real winner is the future'],
    links: [],
  },
  propose: {
    displayName: 'Transmutation',
    header: 'Magic',
    images: [],
    bodyText: ['From water into wine'],
    links: [],
  },
  summonMoloch: {
    displayName: 'Summon New Moloch',
    header: 'Summon a DAO',
    images: [],
    bodyText: [
      'Our magic internet communities take a minute or two to create. After the transaction completes, you will be prompted to configure your DAO.',
    ],
    links: [],
    successText: 'A New DAO Has RISEN!',
    waitingText:
      'If this is mainnet and taking awhile, you can come back later. If/when the transaction completes, you will soon see the new DAO in your Hub.',
  },
};
