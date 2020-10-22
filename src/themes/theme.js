import { theme } from '@chakra-ui/core';

const defaultTheme = {
  brand100: '#0E1235',
  brand200: '#03061B',
  brandImg: '',
};

export const customTheme = (daoTheme) => {
  const themeOverrides = daoTheme || defaultTheme;
  return {
    ...theme,
    colors: {
      ...theme.colors,
      brand: {
        ...theme.colors.brand,
        100: themeOverrides.brand100,
        200: themeOverrides.brand200,
      },
    },
  };
};
