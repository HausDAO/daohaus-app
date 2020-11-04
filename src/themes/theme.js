import { theme, extendTheme } from '@chakra-ui/core';
import Brand from '../assets/themes/hausdao/Daohaus__Castle--Dark.svg';
import { customIcons } from './icons';
import { lighten, darken } from 'polished';

export * from './components';

const defaultTheme = {
  brand500: '#10153d',
  secondary500: '#EB8A23',
  brandImg: Brand,
  bg500: '#03061B',
  primaryFont: 'Inknut Antiqua',
  bodyFont: 'Rubik',
  daoMeta: {
    proposals: 'Proposals',
    proposal: 'Proposal',
    bank: 'Bank',
    members: 'Members',
    member: 'Member',
  },
};

export const customTheme = (daoTheme) => {
  const themeOverrides = daoTheme || defaultTheme;
  return {
    ...theme,
    colors: {
      ...theme.colors,
      brand: {
        ...theme.colors.brand,
        50: lighten(0.4, themeOverrides.brand500),
        100: lighten(0.3, themeOverrides.brand500),
        200: lighten(0.2, themeOverrides.brand500),
        300: lighten(0.1, themeOverrides.brand500),
        400: lighten(0.05, themeOverrides.brand500),
        500: themeOverrides.brand500,
        600: darken(0.05, themeOverrides.brand500),
        700: darken(0.1, themeOverrides.brand500),
        800: darken(0.15, themeOverrides.brand500),
        900: darken(0.2, themeOverrides.brand500),
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
    },
  };
};
