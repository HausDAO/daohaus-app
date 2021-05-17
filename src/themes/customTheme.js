import { extendTheme } from '@chakra-ui/react';
import { lighten, darken, rgba } from 'polished';
import ContentBoxComponent from './components/contentBox';
import TextBoxComponent from './components/textBox';

const shadeTemplate = [
  { shade: 50, degree: 0.4 },
  { shade: 100, degree: 0.3 },
  { shade: 200, degree: 0.2 },
  { shade: 300, degree: 0.1 },
  { shade: 400, degree: 0.05 },
  { shade: 500, degree: 0 },
  { shade: 600, degree: 0.05 },
  { shade: 700, degree: 0.1 },
  { shade: 800, degree: 0.15 },
  { shade: 900, degree: 0.2 },
];
const getShade = (shade, degree, seedColor) => {
  if (shade < 500) return lighten(degree, seedColor);
  if (shade === 500) return seedColor;
  if (shade > 500) return darken(degree, seedColor);

  throw new Error(`Argument ${shade} is not a valid shade value`);
};

const getAllShades = seedColor =>
  shadeTemplate.reduce(
    (obj, { shade, degree }) => ({
      ...obj,
      [shade]: getShade(shade, degree, seedColor),
    }),
    {},
  );

export const defaultThemeData = {
  styles: {
    bgOverlayOpacity: '0.75',
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
  colors: {
    THEME_NAME: 'DEFAULT',
    primary: getAllShades('#10153d'),
    secondary: getAllShades('#EB8A23'),
    background: getAllShades('#03061B'),
    primaryAlpha: rgba('#10153d', 0.9),
    secondaryAlpha: rgba('#EB8A23', 0.75),
  },
  fonts: {
    heading: 'Inknut Antiqua',
    body: 'Rubik',
    mono: 'Space Mono',
    hub: 'Mirza',
    accessory: 'Roboto Mono',
    space: 'Space Mono',
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
        solid: () => ({
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
        outline: () => ({
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
        solid: () => ({
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
        outline: () => ({
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
        ghost: () => ({
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
      variants: {
        d2: {
          color: 'blackAlpha.900',
        },
      },
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
        solid: () => ({}),
        outline: () => ({
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

  // brandImg: BrandImg,
  // bgImg: BgImg,
};
export const defaultTheme = extendTheme(defaultThemeData);

export const createNewTheme = newTheme => {
  const newThemeData = {
    // THEME_NAME: newTheme.daoMeta.daoName,
    active: true,
    colors: {
      primary: getAllShades(newTheme.primary500),
      secondary: getAllShades(newTheme.secondary500),
      background: getAllShades(newTheme.bg500),
    },
  };
  return extendTheme({ ...defaultTheme, ...newThemeData });
};
