import React, { useContext, createContext, useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
// import { defaultTheme } from "../themes/defaultTheme";
// import { defaultTheme, createNewTheme } from "../themes/customTheme";
import { createTheme, useDefault } from '../themes/theme';
import OverlayProvider from './OverlayContext';

export const CustomThemeContext = createContext();

export const CustomThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(useDefault);
  const [tempTheme, setTempTheme] = useState(null);
  // const [customCopy, setCustomCopy] = useState(null);

  const updateTheme = (themeData) => {
    console.log(themeData);
    const newTheme = createTheme(themeData);
    setTheme(newTheme);
  };

  const updateTempTheme = (theme) => {
    setTempTheme(theme);
  };

  const resetTheme = () => setTheme(useDefault);

  return (
    <CustomThemeContext.Provider
      value={{ theme, updateTheme, tempTheme, updateTempTheme, resetTheme }}
    >
      <ChakraProvider theme={theme}>
        <OverlayProvider>{children}</OverlayProvider>
      </ChakraProvider>
    </CustomThemeContext.Provider>
  );
};

export const useCustomTheme = () => {
  const {
    theme,
    updateTheme,
    tempTheme,
    updateTempTheme,
    resetTheme,
  } = useContext(CustomThemeContext);
  return { theme, updateTheme, tempTheme, updateTempTheme, resetTheme };
};
