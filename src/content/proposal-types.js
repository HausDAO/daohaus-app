export const proposalTypes = (theme) => {
  return [
    {
      name: 'Membership',
      subhead: 'Join the DAO!',
      proposalType: 'member',
      image: 'themes/raidTheme/raidguild__swords-white.svg',
    },
    {
      name: 'Funding',
      subhead: 'Distribute funds',
      proposalType: 'funding',
      image: 'themes/raidTheme/raidguild__swords-white.svg',
    },
    {
      name: 'Token',
      subhead: 'Approve a new asset',
      proposalType: 'whitelist',
      image: 'themes/raidTheme/raidguild__swords-white.svg',
    },
    {
      name: 'Trade',
      subhead: 'Trade assets',
      proposalType: 'trade',
      image: 'themes/raidTheme/raidguild__swords-white.svg',
    },
    {
      name: 'Guild Kick',
      subhead: `Remove a ${theme.daoMeta.member}`,
      proposalType: 'guildkick',
      image: 'themes/raidTheme/raidguild__swords-white.svg',
    },
    {
      name: 'Minion',
      subhead: 'Minion Simple',
      proposalType: 'minion',
      image: 'themes/raidTheme/raidguild__swords-white.svg',
      comingSoon: true,
    },
  ];
};
