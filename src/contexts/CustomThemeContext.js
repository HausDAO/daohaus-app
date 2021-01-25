import React, { useContext, createContext, useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
// import { defaultTheme } from "../themes/defaultTheme";
// import { defaultTheme, createNewTheme } from "../themes/customTheme";
import { createTheme, useDefault } from "../themes/theme";
import OverlayProvider from "./OverlayContext";

export const CustomThemeContext = createContext();

export const CustomThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(useDefault);
  // const [customCopy, setCustomCopy] = useState(null);

  const updateTheme = (themeData) => {
    const newTheme = createTheme(themeData);
    setTheme(newTheme);
  };

  const resetTheme = () => setTheme(useDefault);

  return (
    <CustomThemeContext.Provider value={{ theme, updateTheme, resetTheme }}>
      <ChakraProvider theme={theme}>
        <OverlayProvider>{children}</OverlayProvider>
      </ChakraProvider>
    </CustomThemeContext.Provider>
  );
};

export const useCustomTheme = () => {
  const { theme, updateTheme, resetTheme } = useContext(CustomThemeContext);
  return { theme, updateTheme, resetTheme };
};
