import { getCopy } from '../utils/metadata';
export const proposalTypes = (customTerms) => {
  return [
    {
      name: 'Membership',
      subhead: 'Join the DAO!',
      proposalType: 'member',
      image: 'swords-white.svg',
      show: true,
    },
    {
      name: 'Funding',
      subhead: 'Distribute funds',
      proposalType: 'funding',
      image: 'swords-white.svg',
      show: true,
    },
    {
      name: 'Token',
      subhead: 'Approve a new asset',
      proposalType: 'whitelist',
      image: 'swords-white.svg',
      show: true,
    },
    {
      name: 'Trade',
      subhead: 'Trade assets',
      proposalType: 'trade',
      image: 'swords-white.svg',
      show: true,
    },
    {
      name: 'Guild Kick',
      subhead: `Remove a ${getCopy(customTerms, 'member')}`,
      proposalType: 'guildkick',
      image: 'swords-white.svg',
      show: true,
    },
    {
      name: 'Minion',
      subhead: 'Minion Simple',
      proposalType: 'minion',
      image: 'swords-white.svg',
      comingSoon: false,
      show: true,
    },
    // {
    //   name: 'Transmutation',
    //   subhead: 'Transmutation',
    //   proposalType: 'transmutation',
    //   image: 'themes/raidTheme/raidguild__swords-white.svg',
    //   comingSoon: false,
    //   show: api.transmutation,
    // },
  ];
};

export const daoToDaoProposalTypes = () => {
  return [
    {
      name: 'Stake',
      subhead: 'Have your DAO join UBERhaus',
      proposalType: 'd2dStake',
      image: 'themes/raidTheme/raidguild__swords-white.svg',
      show: true,
    },
    {
      name: 'Vote',
      subhead: 'Vote on proposals in UberHaus',
      proposalType: 'd2dVote',
      image: 'themes/raidTheme/raidguild__swords-white.svg',
      show: false,
    },
    {
      name: 'Delegate',
      subhead: "Manage your DAO's delegate",
      proposalType: 'd2dDelegate',
      image: 'themes/raidTheme/raidguild__swords-white.svg',
      show: true,
    },
    {
      name: 'Rage Quit',
      subhead: 'RageQuit your % of $HAUS from UBERhaus',
      proposalType: 'd2dRageQuit',
      image: 'themes/raidTheme/raidguild__swords-white.svg',
      show: true,
    },
    {
      name: 'Distro Rewards',
      subhead: 'Get DAO Rewards from UBERhaus',
      proposalType: 'd2dDistroRewards',
      image: 'themes/raidTheme/raidguild__swords-white.svg',
      show: true,
    },
  ];
};
