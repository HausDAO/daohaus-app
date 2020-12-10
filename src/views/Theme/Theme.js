import React from 'react';

import { useTempTheme, useTheme } from '../../contexts/CustomThemeContext';
import { defaultTheme } from '../../themes/theme-defaults';
// import DaoMetaForm from './DaoMetaForm';
import ThemeColorsForm from '../../components/Forms/ThemeColorForm';
import ThemePrebuilt from './ThemePrebuilt';
import ThemeSamples from './ThemeSamples';

const Theme = () => {
  const [, setTheme] = useTheme();
  const [tempTheme, setTempTheme] = useTempTheme();

  const handleThemeUpdate = (update) => {
    const currentValues = tempTheme || defaultTheme;
    const themeUpdate = { ...currentValues, ...update };
    setTempTheme(themeUpdate);
    setTheme(themeUpdate);
  };

  const resetTheme = () => {
    setTheme();
  };

  return (
    <>
      <ThemeColorsForm
        handleThemeUpdate={handleThemeUpdate}
        resetTheme={resetTheme}
      />

      <ThemePrebuilt handleThemeUpdate={handleThemeUpdate} />

      {/* <DaoMetaForm handleThemeUpdate={handleThemeUpdate} /> */}

      <ThemeSamples />
    </>
  );
};

export default Theme;
