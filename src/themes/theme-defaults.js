import { rgba } from 'polished';

import BrandImg from '../assets/themes/hausdao/Daohaus__Castle--Dark.svg';
import BgImg from '../assets/themes/hausdao/daohaus__hero--falling.jpg';
import raidBg from '../assets/themes/raidTheme/raid__fantasy--bg.jpg';
import raidBrand from '../assets/themes/raidTheme/raidguild__swords.svg';
import yearnBg from '../assets/themes/yearn/yearn__bg--pattern--blueonwhite--light.png';
import yearnBrand from '../assets/themes/yearn/yearn__brand__square.png';
import mcvBg from '../assets/themes/mcv/mcv__bg.jpg';
import mcvBrand from '../assets/themes/mcv/mcv__brand__square.png';

export const defaultTheme = {
  primary500: '#10153d',
  primaryAlpha: rgba('#10153d', 0.9),
  secondary500: '#EB8A23',
  secondaryAlpha: rgba('#EB8A23', 0.75),
  bg500: '#03061B',
  bgOverlayOpacity: '0.75',
  headingFont: 'Inknut Antiqua',
  bodyFont: 'Rubik',
  monoFont: 'Space Mono',
  avatarImg: BrandImg,
  bgImg: BgImg,
  daoMeta: {
    proposals: 'Proposals',
    proposal: 'Proposal',
    bank: 'Bank',
    members: 'Members',
    member: 'Member',
    boosts: 'Apps',
    boost: 'App',
    f04title: "404 What's Lost Can Be Found",
    f04heading: 'You have been slain',
    f04subhead: 'Please reload from the most recent save point.',
    f04cta: 'Start Over',
  },
};

export const raidGuildTheme = {
  primary500: '#ff3864',
  secondary500: '#6F3EFC',
  bg500: '#121212',
  avatarImg: raidBrand,
  bgImg: raidBg,
  bgOverlayOpacity: '0.5',
  primaryFont: 'Space Mono', // only temporary
  bodyFont: 'Rubik',
  daoMeta: {
    proposals: 'Quests',
    proposal: 'Quest',
    bank: 'Inventory',
    members: 'Players',
    member: 'Player',
    boosts: 'Boosts',
    boost: 'Boost',
    f04title: '404 Game Over',
    f04heading: 'You have been slain',
    f04subhead: 'Please reload from the most recent save point.',
    f04cta: 'Start Over',
  },
};

export const mcvTheme = {
  primary500: '#C93C4F',
  secondary500: '#FFA229',
  bg500: '#121212',
  avatarImg: mcvBrand,
  bgImg: mcvBg,
  bgOverlayOpacity: '0.5',
  primaryFont: 'Space Mono', // only temporary
  bodyFont: 'Rubik',
  daoMeta: {
    proposals: 'Quests',
    proposal: 'Quest',
    bank: 'Inventory',
    members: 'Players',
    member: 'Player',
    boosts: 'Apps',
    boost: 'App',
    f04title: '404 Game Over',
    f04heading: 'You have been slain',
    f04subhead: 'Please reload from the most recent save point.',
    f04cta: 'Start Over',
  },
};

export const yearnTheme = {
  primary500: '#007bff',
  secondary500: '#DC6BE5',
  bg500: '#03061B',
  avatarImg: yearnBrand,
  bgImg: yearnBg,
  bgOverlayOpacity: '0.5',
  primaryFont: 'Space Mono', // only temporary
  bodyFont: 'Rubik',
  daoMeta: {
    proposals: 'Quests',
    proposal: 'Quest',
    bank: 'Inventory',
    members: 'Waifus',
    member: 'Waifu',
    boosts: 'Apps',
    boost: 'App',
    f04title: '404 Game Over',
    f04heading: 'You have been slain',
    f04subhead: 'Please reload from the most recent save point.',
    f04cta: 'Start Over',
  },
};
