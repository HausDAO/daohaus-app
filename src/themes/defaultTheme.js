import { rgba } from 'polished';

import BrandImg from '../assets/img/Daohaus__Castle--Dark.svg';
import BgImg from '../assets/img/daohaus__hero--falling.jpg';

export const defaultTheme = {
  primary500: '#10153d',
  primaryAlpha: rgba('#10153d', 0.9),
  secondary500: '#EB8A23',
  secondaryAlpha: rgba('#10153d', 0.75),
  bg500: '#03061B',
  bgAlpha: '#03061B',
  bgOverlayOpacity: 0.75,
  modeAlpha500: '#FFFFFF',
  headingFont: 'Mulish',
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
    settings: 'Settings',
    ragequit: 'Rage Quit',
    guildKick: 'Guild Kick',
    minion: 'Minion',
    minions: 'Minions',
  },
};

// halloween
// export const defaultTheme = {
//   primary500: '#4a5443',
//   primaryAlpha: rgba(74, 84, 67, 0.9),
//   secondary500: '#d29100',
//   secondaryAlpha: rgba(210, 145, 0, 0.75),
//   bg500: '#000000',
//   bgAlpha: '#03061B',
//   bgOverlayOpacity: 0.41,
//   modeAlpha500: '#FFFFFF',
//   headingFont: 'Mulish',
//   bodyFont: 'Rubik',
//   monoFont: 'Space Mono',
//   avatarImg: BrandImg,
//   bgImg: 'QmU34AoT8VedXx1DV2FRsSKXmchEqgEYPs7dsdsRre4WUz',
//   daoMeta: {
//     proposals: 'Proposals',
//     proposal: 'Proposal',
//     bank: 'Bank',
//     members: 'Members',
//     member: 'Member',
//     boosts: 'Apps',
//     boost: 'App',
//     settings: 'Settings',
//     ragequit: 'Rage Quit',
//     guildKick: 'Guild Kick',
//     minion: 'Minion',
//     minions: 'Minions',
//   },
// };
