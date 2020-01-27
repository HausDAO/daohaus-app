import { lighten, darken } from 'polished';

export const baseFont = `'Roboto', sans-serif`;
export const dataFont = `'Share Tech Mono', sans-serif`;
export const baseFontColor = 'black';
export const basePadding = '15px';
export const basePadding2x = `${basePadding} * 2`;
export const brand = 'japanese-ogre.png';

// Color Palette
export const appBackground = `#F8F8FC`;
export const appLight = lighten(0.9, appBackground);
export const appDark = darken(0.9, appBackground);
export const primary = `rgba(203,46,206,1)`;
export const secondary = `rgba(47,233,167,1)`;
export const tertiary = `rgba(239,73,123,1)`;
export const primaryHover = darken(0.9, primary);
export const secondaryHover = darken(0.9, secondary);
export const tertiaryHover = darken(0.9, tertiary);
export const danger = `rgba(239,73,95,1)`;
export const dangerHover = darken(0.9, danger);
export const success = `rgba(77,204,44,1)`;
export const bright = `rgba(189,134,254,1)`;
