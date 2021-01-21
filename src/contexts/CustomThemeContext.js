import React, { useContext, createContext, useState } from "react";
import { ThemeProvider } from "@chakra-ui/react";
import { defaultTheme, createNewTheme } from "../utils/metadata";
import deepEql from "deep-eql";
import OverlayProvider from "./OverlayContext";

export const CustomeThemeContext = createContext();

export const CustomeThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(defaultTheme);
  const [customCopy, setCustomCopy] = useState(null);

  const updateTheme = (themeData) => {
    const hasNotChanged = deepEql(theme, themeData);
    if (hasNotChanged) return;
    else {
      setTheme(createNewTheme(themeData));
      setCustomCopy(themeData.boostMetadata.daoMeta);
    }
  };

  const resetTheme = () => setTheme(defaultTheme);

  return (
    <CustomeThemeContext.Provider
      value={{ theme, updateTheme, resetTheme, customCopy }}
    >
      <ThemeProvider theme={theme}>
        <OverlayProvider>{children}</OverlayProvider>
      </ThemeProvider>
    </CustomeThemeContext.Provider>
  );
};

export const useCustomTheme = () => {
  const { theme, updateTheme, resetTheme, customCopy } = useContext(
    CustomeThemeContext
  );
  return { theme, updateTheme, resetTheme, customCopy };
};
