import { getTerm } from '../utils/metadata';
import swordImg from '../assets/img/swords-white.svg';

export const proposalTypes = (customTerms, boosts, minions) => {
  const daoPropTypes = boosts?.proposalTypes?.metadata;
  return [
    {
      name: 'Membership',
      subhead: 'Request Shares and/or Loot',
      proposalType: 'member',
      image: swordImg,
      show: daoPropTypes ? daoPropTypes?.member?.active : true,
    },
    {
      name: 'Funding',
      subhead: 'Request or distribute funds',
      proposalType: 'funding',
      image: swordImg,
      show: daoPropTypes ? daoPropTypes?.funding?.active : true,
    },
    {
      name: 'Token',
      subhead: 'Approve a new token',
      proposalType: 'whitelist',
      image: swordImg,
      show: daoPropTypes ? daoPropTypes?.whitelist?.active : true,
    },
    {
      name: 'Trade',
      subhead: 'Trade tokens',
      proposalType: 'trade',
      image: swordImg,
      show: daoPropTypes ? daoPropTypes?.trade?.active : true,
    },
    {
      name: 'Guild Kick',
      subhead: `Remove a ${getTerm(customTerms, 'member')}`,
      proposalType: 'guildkick',
      image: swordImg,
      show: daoPropTypes ? daoPropTypes?.guildKick?.active : true,
    },
    {
      name: 'Minion',
      subhead: 'Minion Simple',
      proposalType: 'minion',
      image: swordImg,
      comingSoon: false,
      show: minions > 0,
    },
    {
      name: 'Superfluid',
      subhead: 'Streaming money minion',
      proposalType: 'superfluidMinion',
      image: swordImg,
      comingSoon: false,
      show: minions > 0,
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
      subhead: 'Request Loot with a tribute',
      proposalType: 'lootgrab',
      image: swordImg,
      comingSoon: false,
      show: daoPropTypes ? daoPropTypes?.lootGrab?.active : false,
    },
  ];
};

export const daoToDaoProposalTypes = () => {
  return [
    {
      name: 'Stake',
      subhead: 'Have your DAO join UBERhaus',
      proposalType: 'd2dStake',
      image: swordImg,
      show: true,
    },
    {
      name: 'Vote',
      subhead: 'Vote on proposals in UberHaus',
      proposalType: 'd2dVote',
      image: swordImg,
      show: false,
    },
    {
      name: 'Delegate',
      subhead: "Manage your DAO's delegate",
      proposalType: 'd2dDelegate',
      image: swordImg,
      show: true,
    },
    {
      name: 'Rage Quit',
      subhead: 'RageQuit your % of $HAUS from UBERhaus',
      proposalType: 'd2dRageQuit',
      image: swordImg,
      show: true,
    },
    // {
    //   name: 'Distro Rewards',
    //   subhead: 'Get DAO Rewards from UBERhaus',
    //   proposalType: 'd2dDistroRewards',
    //   image: swordImg,
    //   show: true,
    // },
    {
      name: 'Pull/Withdraw',
      subhead: 'Pull or withdraw funds',
      proposalType: 'd2dWithdraw',
      image: swordImg,
      show: true,
    },
  ];
};
