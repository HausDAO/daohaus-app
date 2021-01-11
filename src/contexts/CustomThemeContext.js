import React, { useContext, createContext, useState } from "react";
import { ThemeProvider } from "@chakra-ui/react";
import { defaultTheme, createNewTheme } from "../utils/metadata";
import deepEql from "deep-eql";

export const CustomeThemeContext = createContext();

export const CustomeThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(defaultTheme);
  console.log(theme);
  const updateTheme = (themeData) => {
    const hasNotChanged = deepEql(theme, themeData);
    if (hasNotChanged) return;
    else {
      setTheme(createNewTheme(themeData));
    }
  };

  const resetTheme = () => setTheme(defaultTheme);

  return (
    <CustomeThemeContext.Provider value={{ updateTheme, resetTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CustomeThemeContext.Provider>
  );
};

export const useTheme = () => {
  const { updateTheme, resetTheme } = useContext(CustomeThemeContext);
  return { updateTheme, resetTheme };
};
