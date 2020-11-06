import { theme, extendTheme } from '@chakra-ui/core';
import BrandImg from '../assets/themes/hausdao/Daohaus__Castle--Dark.svg';
import BgImg from '../assets/themes/hausdao/daohaus__hero--falling.jpg';
import { lighten, darken } from 'polished';

export * from './components';

const defaultTheme = {
  primary500: '#10153d',
  secondary500: '#EB8A23',
  brandImg: BrandImg,
  bgImg: BgImg,
  bg500: '#03061B',
  bgOverlayOpacity: '0.75',
  primaryFont: 'Inknut Antiqua',
  bodyFont: 'Rubik',
  daoMeta: {
    proposals: 'Proposals',
    proposal: 'Proposal',
    bank: 'Bank',
    members: 'Members',
    member: 'Member',
    discord: 'https://discord.gg/NPEJysW',
    medium: 'https://medium.com/daohaus-club',
    telegram: '',
    website: '',
    other: '',
  },
};

export const customTheme = (daoTheme) => {
  console.log('returing customTheme');
  const themeOverrides = daoTheme || defaultTheme;
  return {
    ...theme,
    colors: {
      ...theme.colors,
      primary: {
        ...theme.colors.primary,
        50: lighten(0.4, themeOverrides.primary500),
        100: lighten(0.3, themeOverrides.primary500),
        200: lighten(0.2, themeOverrides.primary500),
        300: lighten(0.1, themeOverrides.primary500),
        400: lighten(0.05, themeOverrides.primary500),
        500: themeOverrides.primary500,
        600: darken(0.05, themeOverrides.primary500),
        700: darken(0.1, themeOverrides.primary500),
        800: darken(0.15, themeOverrides.primary500),
        900: darken(0.2, themeOverrides.primary500),
      },
      background: {
        ...theme.colors.background,
        50: lighten(0.4, themeOverrides.bg500),
        100: lighten(0.3, themeOverrides.bg500),
        200: lighten(0.2, themeOverrides.bg500),
        300: lighten(0.1, themeOverrides.bg500),
        400: lighten(0.05, themeOverrides.bg500),
        500: themeOverrides.bg500,
        600: darken(0.05, themeOverrides.bg500),
        700: darken(0.1, themeOverrides.bg500),
        800: darken(0.15, themeOverrides.bg500),
        900: darken(0.2, themeOverrides.bg500),
      },
      secondary: {
        ...theme.colors.secondary,
        50: lighten(0.4, themeOverrides.secondary500),
        100: lighten(0.3, themeOverrides.secondary500),
        200: lighten(0.2, themeOverrides.secondary500),
        300: lighten(0.1, themeOverrides.secondary500),
        400: lighten(0.05, themeOverrides.secondary500),
        500: themeOverrides.secondary500,
        600: darken(0.05, themeOverrides.secondary500),
        700: darken(0.1, themeOverrides.secondary500),
        800: darken(0.15, themeOverrides.secondary500),
        900: darken(0.2, themeOverrides.secondary500),
      },
    },
    images: {
      ...theme.images,
      brandImg: themeOverrides.brandImg,
      bgImg: themeOverrides.bgImg,
    },
    icons: {
      ...theme.icons,
    },
    fonts: {
      ...theme.fonts,
      heading: themeOverrides.primaryFont,
      body: themeOverrides.bodyFont,
      hub: 'Mirza',
      accessory: 'Roboto Mono',
      space: 'Space Mono',
    },
    daoMeta: {
      proposals: themeOverrides.daoMeta.proposals,
      proposal: themeOverrides.daoMeta.proposal,
      bank: themeOverrides.daoMeta.bank,
      members: themeOverrides.daoMeta.members,
      member: themeOverrides.daoMeta.member,
      discord: themeOverrides.daoMeta.discord,
      medium: themeOverrides.daoMeta.medium,
      medium: themeOverrides.daoMeta.telegram,
      medium: themeOverrides.daoMeta.website,
      medium: themeOverrides.daoMeta.other,
    },
    styles: {
      ...theme.styles,
      bgOverlayOpacity: themeOverrides.bgOverlayOpacity,
      global: {
        'html, body': {
          fontSize: 'm',
          color: 'whiteAlpha.600',
          lineHeight: 'tall',
        },
        a: {
          color: 'inherit',
          textDecoration: 'none',
          _hover: { textDecoration: 'none' },
        },
      },
    },
  };
};
