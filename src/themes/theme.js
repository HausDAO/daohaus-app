import { extendTheme } from '@chakra-ui/react';
import { lighten, darken } from 'polished';
//Custom Chakra Components
import { ContentBoxComponent } from './content-box-component';
import { TextBoxComponent } from './text-box-component';
import { defaultTheme } from './theme-defaults';

export const getRandomTheme = async (images) => {
  const theme = {
    primary500: `#${((Math.random() * 0xffffff) << 0)
      .toString(16)
      .padStart(6, '0')}`,
    secondary500: `#${((Math.random() * 0xffffff) << 0)
      .toString(16)
      .padStart(6, '0')}`,
    bg500: `#${((Math.random() * 0xffffff) << 0)
      .toString(16)
      .padStart(6, '0')}`,
  };

  if (images) {
    const request = new Request('https://source.unsplash.com/random/200x200');
    const avatarImg = await fetch(request);

    const requestBg = new Request('https://source.unsplash.com/random/800x800');
    const bgImg = await fetch(requestBg);

    theme.avatarImg = avatarImg.url;
    theme.bgImg = bgImg.url;
  }

  return theme;
};

export const setTheme = (daoTheme) => {
  const themeOverrides = { ...defaultTheme, ...daoTheme };

  return extendTheme({
    colors: {
      secondaryAlpha: themeOverrides.secondaryAlpha,
      primaryAlpha: themeOverrides.primaryAlpha,
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
      avatarImg: themeOverrides.avatarImg,
      bgImg: themeOverrides.bgImg,
    },
    fonts: {
      heading: themeOverrides.headingFont,
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
      boosts: themeOverrides.daoMeta.boosts,
      boost: themeOverrides.daoMeta.boost,
      f04title: themeOverrides.daoMeta.f04title,
      f04heading: themeOverrides.daoMeta.f04heading,
      f04subhead: themeOverrides.daoMeta.f04subhead,
      f04cta: themeOverrides.daoMeta.f04cta,
    },
    components: {
      ContentBoxComponent,
      TextBoxComponent,
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
          sideNav: {
            bg: 'transparent',
            color: 'whiteAlpha.900',
            borderRadius: '9999px',
            height: '56px',
            alignItems: 'center',
            justifyContent: 'flex-start',
            _hover: { bg: 'transparent', color: 'secondary.500', scale: '1' },
            _active: {
              boxShadow: 'none',
              borderColor: 'transparent',
              outline: 'none',
              backgroundColor: 'white',
            },
            _focus: {
              boxShadow: 'none',
              borderColor: 'transparent',
              outline: 'none',
            },
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
      IconButton: {
        // 1. Update the base styles
        baseStyle: {
          borderRadius: '9999px',
          _hover: { scale: '5' },
        },
        // 2. Add a new button size or extend existing
        sizes: {},
        // 3. Add a new visual variant
        defaultProps: { isRound: 'true' },
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
          ghost: (props) => ({
            bg: 'transparent',
            color: 'whiteAlpha.900',
            _hover: {
              borderColor: 'secondary.500',
              color: 'secondary.500',
              bg: 'whiteAlpha.900',
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
      Modal: {
        parts: ['overlay'],
        baseStyle: {
          overlay: {
            bg: 'primaryAlpha',
          },
        },
        sizes: {},
        defaultProps: {},
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
      Tabs: {
        parts: ['root', 'tablist', 'tab', 'tabpanel', 'indicator'],
        baseStyle: {
          root: {
            color: 'whiteAlpha.500',
            borderColor: 'whiteAlpha.500',
          },
          tab: {
            bg: 'transparent',
            color: 'inherit',
            borderColor: 'inherit',
            borderBottom: '1px solid',
            _hover: {
              color: 'whiteAlpha.800',
              borderColor: 'whiteAlpha.800',
            },
            _focus: {
              color: 'whiteAlpha.900',
            },
            _selected: {
              color: 'white',
              borderColor: 'white',
            },
            _active: {
              color: 'white',
              borderColor: 'white',
            },
            _disabled: {
              opacity: 0.4,
              cursor: 'not-allowed',
            },
          },
          tablist: {},
          tabpanel: {},
          indicator: {},
        },
        sizes: {},
        defaultProps: {},
      },
      Badge: {
        baseStyle: {
          fontSize: 'xs',
          fontWeight: '400',
        },
        variants: {
          solid: (props) => ({}),
          outline: (props) => ({
            color: 'whiteAlpha.700',
          }),
        },
        sizes: {},
        defaultProps: {
          variant: 'outline',
        },
      },
      Heading: {
        baseStyle: {},
        variants: {
          label: {
            color: 'whiteAlpha.700',
            fontSize: 'xs',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginTop: 0,
            lineHeight: 'xs',
          },
          value: {
            color: 'whiteAlpha.900',
            fontWeight: '400',
            fontFamily: 'mono',
            fontSize: 'xl',
          },
        },
        sizes: {},
        defaultProps: {},
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
