import { extendTheme } from '@chakra-ui/core';
import BrandImg from '../assets/themes/hausdao/Daohaus__Castle--Dark.svg';
import BgImg from '../assets/themes/hausdao/daohaus__hero--falling.jpg';
import { lighten, darken, rgba } from 'polished';

export * from './components';

export const defaultTheme = {
  primary500: '#10153d',
  secondary500: '#EB8A23',
  secondaryAlpha: rgba('#EB8A23', 0.5),
  bg500: '#03061B',
  bgOverlayOpacity: '0.75',
  primaryFont: 'Inknut Antiqua',
  bodyFont: 'Rubik',
  monoFont: 'Space Mono',
  brandImg: BrandImg,
  bgImg: BgImg,
  daoMeta: {
    proposals: 'Proposals',
    proposal: 'Proposal',
    bank: 'Bank',
    members: 'Members',
    member: 'Member',
    discord: 'https://discord.gg/NPEJysW',
    medium: 'https://medium.com/daohaus-club',
    telegram: 'https://t.me/joinchat/IJqu9xPa0xzYLN1mmFKo8g',
    website: 'https://daohaus.club',
    other: 'https://wikipedia.com',
  },
};

export const setTheme = (daoTheme) => {
  const themeOverrides = daoTheme || defaultTheme;
  return extendTheme({
    colors: {
      secondaryAlpha: themeOverrides.secondaryAlpha,
      primary: {
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
      brandImg: themeOverrides.brandImg,
      bgImg: themeOverrides.bgImg,
    },
    fonts: {
      heading: themeOverrides.primaryFont,
      body: themeOverrides.bodyFont,
      mono: themeOverrides.monoFont,
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
      telegram: themeOverrides.daoMeta.telegram,
      website: themeOverrides.daoMeta.website,
      other: themeOverrides.daoMeta.other,
    },
    components: {
      Button: {
        // 1. Update the base styles
        baseStyle: {
          fontWeight: 'medium', // Normally, it's "semibold"
          _hover: { scale: '1.05' },
        },
        // 2. Add a new button size or extend existing
        sizes: {},
        // 3. Add a new visual variant
        variants: {
          primary: {
            bg: 'primary.400',
            _hover: { bg: 'primary.500' },
          },
          // 4. Override existing variants
          solid: (props) => ({
            bg: 'secondary.400',
            color: 'white',
            _hover: { bg: 'secondary.500', color: 'white' },
            _focus: {
              bg: 'secondary.500',
              color: 'white',
              boxShadow: '0 0 0 3px blackAlpha.600',
            },
            _active: { bg: 'inherit' },
          }),
          outline: (props) => ({
            borderColor: 'secondary.400',
            bg: 'transparent',
            color: 'secondary.400',
            _hover: {
              borderColor: 'secondary.500',
              color: 'secondary.500',
              bg: 'transparent',
            },
            _active: { bg: 'inherit' },
          }),
        },
      },
      Menu: {
        parts: ['menu', 'button', 'item', 'list'],
        baseStyle: {
          menu: {
            boxShadow: 'lg',
            rounded: 'lg',
            flexDirection: 'column',
            py: '2',
            color: 'white',
            borderColor: 'whiteAlpha.50',
          },
          list: {
            bg: 'blackAlpha.800',
          },
          item: {
            fontWeight: 'medium',
            lineHeight: 'tall',
            color: 'white',
            _hover: { bg: 'secondary.500' },
            _active: { bg: 'secondary.500' },
            _focus: { bg: 'secondary.500' },
          },
        },
        sizes: {},
        defaultProps: {
          size: 'md',
        },
      },
      Input: {
        parts: ['field', 'addon'],
        baseStyle: {
          field: {
            borderColor: 'whiteAlpha.50',
            color: 'whiteAlpha.900',
            focusBorderColor: 'secondary.500',
          },
          addon: {
            color: 'whiteAlpha.900',
            bg: 'transparent',
            focusBorderColor: 'secondary.500',
          },
        },
        variants: {},
        sizes: {},
        defaultProps: {
          size: 'md',
          focusBorderColor: 'secondary.500',
        },
      },
      Textarea: {
        baseStyle: {
          color: 'whiteAlpha.900',
        },
        defaultProps: {
          focusBorderColor: 'secondary.500',
        },
      },
      Link: {
        baseStyle: {
          transition: 'all 0.15s linear',
          _hover: { textDecoration: 'none', color: 'secondary.500' },
        },
      },
    },
    styles: {
      bgOverlayOpacity: themeOverrides.bgOverlayOpacity,
      global: {
        'html, body': {
          fontSize: 'm',
          color: 'whiteAlpha.900',
          lineHeight: 'tall',
        },
        a: {
          transition: 'all 0.15s linear',
          _hover: { textDecoration: 'none', color: 'secondary.500' },
        },
      },
    },
  });
};
