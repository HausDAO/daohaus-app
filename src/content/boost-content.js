export const boostList = [
  {
    name: 'Custom Theme',
    key: 'customTheme',
    description: 'Customize the visual theme of your community',
    price: '0',
    modalName: 'customThemeLaunch',
    successRoute: 'theme',
    settings: true,
    networks: {
      all: true,
    },
  },
  {
    name: 'Minion',
    key: 'vanillaMinion',
    description: 'Create and vote on execution of external contracts',
    price: '0',
    modalName: 'vanillaMinionLaunch',
    successRoute: '',
    settings: true,
    networks: {
      all: true,
    },
  },
  {
    name: 'Discord Notificatons',
    key: 'notificationsLevel1',
    description:
      'Customize and send notifications of DAO activity to your discord server',
    price: '0',
    modalName: 'notificationsLevel1Launch',
    successRoute: 'notifications',
    settings: true,
    networks: {
      all: true,
    },
  },
  {
    name: 'Discourse Forum',
    key: 'discourse',
    comingSoon: false,
    description:
      'Launch a new category for your DAO in the DAOhaus Discourse forum and enable topic creation for discussing all of your proposals.',
    price: '0',
    modalName: 'discourseLaunch',
    successRoute: '',
    settings: true,
    networks: {
      all: true,
    },
  },
  {
    name: 'Proposal Types',
    key: 'proposalTypes',
    description:
      'Customize the proposal types available for members to streamline onboarding or other DAO activities.',
    price: '0',
    modalName: 'proposalTypesLaunch',
    successRoute: 'proposals',
    settings: true,
    networks: {
      all: true,
    },
  },
  {
    name: 'MintGate',
    key: 'mintGate',
    description: 'Gate content for your dao to allow private access',
    price: '0',
    modalName: 'genericBoostLaunch',
    successRoute: '',
    link: 'mintgate',
    settings: false,
    networks: {
      all: true,
    },
  },
  {
    name: 'Snapshot Proposals',
    key: 'snapshot',
    description:
      'Gasless voting for quicker, smaller decisions or just collecting signal.',
    price: '0',
    modalName: 'snapshot',
    successRoute: '',
    link: 'snapshot',
    settings: true,
    networks: {
      all: true,
    },
  },
  {
    name: 'Wrap-N-Zap',
    key: 'wrapNZap',
    description:
      'Allow your DAO to receive native ETH, xDAI, or Polygon without senders needing to wrap it first.',
    price: '0',
    modalName: 'wrapNZap',
    successRoute: '',
    settings: true,
    networks: {
      all: false,
      '0x4': true,
      '0x2a': true,
      '0x64': true,
      '0x89': true,
    },
  },
  {
    name: 'Minion Safe',
    key: 'minionSafe',
    description: 'Launch and interact with a Gnosis Safe multisig',
    price: '0',
    comingSoon: true,
    modalName: 'minionSafeLaunch',
    dependency: 'vanillaMinions',
    successRoute: '',
    networks: {
      all: false,
      '0x1': true,
      '0x64': true,
    },
  },
  {
    name: 'Superfluid Minion',
    key: 'superfluidMinion',
    description: 'Stream/distribute tokens using Superfluid Protocol',
    price: '0',
    modalName: 'superfluidMinionLaunch',
    successRoute: '',
    networks: {
      all: false,
      '0x64': true,
      '0x4': true,
      '0x89': true,
    },
  },
  {
    name: 'Token Supply',
    key: 'tokenSupply',
    comingSoon: true,
    description:
      'Bring Your Own Token or a Launch a new one and manage issuance as a DAO.',
    price: '1',
    modalName: 'tokenSupply',
    successRoute: '',
    networks: {
      all: true,
    },
  },
  {
    name: 'Manage Liquidity',
    key: 'liquidity',
    comingSoon: true,
    description: 'Set pool parameters and add or remove liquidity collectively',
    price: '1',
    modalName: 'manageLiquidity',
    successRoute: '',
    networks: {
      all: true,
    },
  },
  {
    name: 'NFT Banks',
    key: 'nftBank',
    comingSoon: true,
    description: 'Buy, sell & showcase NFTs as a DAO',
    price: '1',
    modalName: 'nftBank',
    successRoute: '',
    networks: {
      all: true,
    },
  },
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

export const proposalTypesContent = [
  { key: 'member', label: 'Member', default: true },
  { key: 'funding', label: 'Funding', default: true },
  { key: 'whitelist', label: 'Whitelist', default: true },
  { key: 'trade', label: 'Trade', default: true },
  { key: 'guildKick', label: 'Guild Kick', default: true },
  {
    key: 'lootGrab',
    label: 'Loot Grab',
    default: true,
    options: [
      {
        id: 'ratio',
        label: 'Loot to Tribute Ratio',
        type: 'text',
        default: 1,
        validation: val => +val >= 0 && +val <= 1,
        validationText: 'Must be between 0 and 1',
      },
    ],
  },
  { key: 'transmutation', label: 'Transmutation', default: false },
  { key: 'minion', label: 'Minion', default: false },
];

export const superpowerLinks = [
  { boostKey: 'customTheme', label: 'Custom Theme', link: 'settings/theme' },
  {
    boostKey: 'notificationsLevel1',
    label: 'Notifications',
    link: 'settings/notifications',
  },
  {
    boostKey: 'discourse',
    label: 'Discourse Forum',
    link: 'settings/discourse',
  },
  {
    boostKey: 'proposalTypes',
    label: 'Proposal Settings',
    link: 'settings/proposals',
  },
  {
    boostKey: 'minionSafe',
    label: 'Minion Safe',
    link: 'settings/minion-safe',
  },
  {
    boostKey: 'snapshot',
    label: 'Snapshot',
    modal: 'snapshot',
  },
];
