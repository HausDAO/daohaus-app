import { theme } from '@chakra-ui/core';
import Brand from '../assets/themes/hausdao/Daohaus__Castle--Dark.svg';

export * from './components';

const defaultTheme = {
  brand50: '#1c2363',
  brand100: '#1c2363',
  brand200: '#1c2363',
  brand300: '#1c2363',
  brand400: '#10153d',
  brand500: '#03061B',
  brand600: '#03061B',
  brand700: '#03061B',
  brand800: '#03061B',
  brand900: '#03061B',
  brandImg: Brand,
  bg400: '#03061B',
};

export const customTheme = (daoTheme) => {
  const themeOverrides = daoTheme || defaultTheme;
  return {
    ...theme,
    colors: {
      ...theme.colors,
      brand: {
        ...theme.colors.brand,
        50: themeOverrides.brand50,
        100: themeOverrides.brand100,
        200: themeOverrides.brand200,
        300: themeOverrides.brand300,
        400: themeOverrides.brand400,
        500: themeOverrides.brand500,
        600: themeOverrides.brand600,
        700: themeOverrides.brand700,
        800: themeOverrides.brand800,
        900: themeOverrides.brand900,
      },
      background: {
        ...theme.colors.background,
        50: themeOverrides.bg50,
        100: themeOverrides.bg100,
        200: themeOverrides.bg200,
        300: themeOverrides.bg300,
        400: themeOverrides.bg400,
        500: themeOverrides.bg500,
        600: themeOverrides.bg600,
        700: themeOverrides.bg700,
        800: themeOverrides.bg800,
        900: themeOverrides.bg900,
      },
    },
    images: {
      ...theme.images,
      brandImg: themeOverrides.brandImg,
    },
  };
};
