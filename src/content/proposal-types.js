import { getCopy } from '../utils/metadata';
import swordImg from '../assets/img/swords-white.svg';

export const proposalTypes = (customTerms, boosts, daoid) => {
  return [
    {
      name: 'Membership',
      subhead: 'Join the DAO!',
      proposalType: 'member',
      image: swordImg,
      show: true,
    },
    {
      name: 'Funding',
      subhead: 'Distribute funds',
      proposalType: 'funding',
      image: swordImg,
      show: true,
    },
    {
      name: 'Token',
      subhead: 'Approve a new asset',
      proposalType: 'whitelist',
      image: swordImg,
      show: true,
    },
    {
      name: 'Trade',
      subhead: 'Trade assets',
      proposalType: 'trade',
      image: swordImg,
      show: true,
    },
    {
      name: 'Guild Kick',
      subhead: `Remove a ${getCopy(customTerms, 'member')}`,
      proposalType: 'guildkick',
      image: swordImg,
      show: true,
    },
    {
      name: 'Minion',
      subhead: 'Minion Simple',
      proposalType: 'minion',
      image: swordImg,
      comingSoon: false,
      show: true,
    },
    {
      name: 'Transmutation',
      subhead: 'Transmutation',
      proposalType: 'transmutation',
      image: swordImg,
      comingSoon: false,
      show: boosts?.transmutation && boosts?.transmutation?.active,
    },
    {
      name: 'Loot Grab',
      subhead: 'Get dat loot',
      proposalType: 'lootgrab',
      image: swordImg,
      comingSoon: false,
      show: daoid === '0xff3f8c0b98454306fb0bda57e5ae38cbfa66cc0d',
    },
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
