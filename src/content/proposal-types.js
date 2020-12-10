export const proposalTypes = (theme, dao) => {
  return [
    {
      name: 'Membership',
      subhead: 'Join the DAO!',
      proposalType: 'member',
      image: 'themes/raidTheme/raidguild__swords-white.svg',
      show: true,
    },
    {
      name: 'Funding',
      subhead: 'Distribute funds',
      proposalType: 'funding',
      image: 'themes/raidTheme/raidguild__swords-white.svg',
      show: true,
    },
    {
      name: 'Token',
      subhead: 'Approve a new asset',
      proposalType: 'whitelist',
      image: 'themes/raidTheme/raidguild__swords-white.svg',
      show: true,
    },
    {
      name: 'Trade',
      subhead: 'Trade assets',
      proposalType: 'trade',
      image: 'themes/raidTheme/raidguild__swords-white.svg',
      show: true,
    },
    {
      name: 'Guild Kick',
      subhead: `Remove a ${theme.daoMeta.member}`,
      proposalType: 'guildkick',
      image: 'themes/raidTheme/raidguild__swords-white.svg',
      show: true,
    },
    {
      name: 'Minion',
      subhead: 'Minion Simple',
      proposalType: 'minion',
      image: 'themes/raidTheme/raidguild__swords-white.svg',
      comingSoon: true,
      show: true,
    },
    {
      name: 'Transmutation',
      subhead: 'Transmutation',
      proposalType: 'transmutation',
      image: 'themes/raidTheme/raidguild__swords-white.svg',
      comingSoon: false,
      show: dao?.boosts?.transmutation,
    },
  ];
};
