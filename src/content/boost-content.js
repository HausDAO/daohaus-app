export const boostList = [
  {
    name: 'Custom Theme',
    key: 'customTheme',
    description: 'Customize the visual theme of your community',
    price: '0',
    modalName: 'customThemeLaunch',
  },
  {
    name: 'Minion',
    key: 'vanillaMinion',
    description: 'Create and vote on execution of external contracts',
    price: '0',
    modalName: 'vanillaMinionLaunch',
  },
  {
    name: 'Discord Notificatons',
    key: 'notificationsLevel1',
    // comingSoon: true,
    description:
      'Customize and send notifications of DAO activity to your discord server',
    price: '0',
    modalName: 'notificationsLevel1Launch',
  },
  {
    name: 'Discourse Forum',
    key: 'discourse',
    // comingSoon: true,
    description:
      'Add a forum for discussing proposals. Launch a new category in the DAOhaus Discourse forum and enable topic creation for all of your proposals.',
    price: '0',
    modalName: 'discourseLaunch',
  },
  // {
  //   name: 'Notifications: Level 2',
  //   key: 'notificationsLevel2',
  //   description:
  //     'Customize and send notifications of DAO activity to more of your social channels',
  //   comingSoon: true,
  //   modalName: 'notificationsLevel2Launch',
  //   price: '0',
  // },
];

export const notificationBoostContent = {
  actions: [
    {
      id: 'votingPeriod',
      label: 'Proposal Ready for Voting',
    },
    {
      id: 'newProposal',
      label: 'Proposal Needs Sponsor',
    },
    {
      id: 'proposalClosing',
      label: 'Proposal Needs a Vote',
      comingSoon: true,
    },
    {
      id: 'newMember',
      label: 'New Member is Official',
      comingSoon: true,
    },
    {
      id: 'rageQuit',
      label: 'New Ragequit',
    },
  ],
  channels: [
    { name: 'discord' },
    { name: 'telegram', comingSoon: true },
    { name: 'email', comingSoon: true },
    { name: 'twitter', comingSoon: true },
  ],
  inviteLinks: {
    discord:
      'https://discord.com/api/oauth2/authorize?client_id=736999684471521321&permissions=23552&scope=bot',
  },
};
