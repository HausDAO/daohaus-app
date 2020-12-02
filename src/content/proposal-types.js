export const proposalTypes = (theme) => {
  return [
    {
      name: 'Apply',
      subhead: 'Join the guild!',
      proposalType: 'member',
      image: 'themes/raidTheme/raidguild__swords-white.svg',
    },
    {
      name: 'Funding',
      subhead: 'Request funds',
      proposalType: 'funding',
      image: 'themes/raidTheme/raidguild__swords-white.svg',
    },
    {
      name: 'Token',
      subhead: 'Whitelist a token',
      proposalType: 'whitelist',
      image: 'themes/raidTheme/raidguild__swords-white.svg',
    },
    {
      name: 'Guild Kick',
      subhead: `Remove a ${theme.daoMeta.member}`,
      proposalType: 'guildkick',
      image: 'themes/raidTheme/raidguild__swords-white.svg',
    },
    {
      name: 'Trade',
      subhead: 'Trade funds',
      proposalType: 'trade',
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
