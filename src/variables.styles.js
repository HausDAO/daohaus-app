import { lighten, darken } from 'polished';
import styled from 'styled-components';

export const defaultTheme = {
  baseFont: `'Roboto', sans-serif`,
  dataFont: `'Share Tech Mono', sans-serif`,
  baseFontColor: 'black',
  brand: 'japanese-ogre.png',
  appBackground: `#F8F8FC`,
  primary: `rgba(203,46,206,1)`,
  secondary: `rgba(47,233,167,1)`,
  tertiary: `rgba(239,73,123,1)`,
  danger: `rgba(239,73,95,1)`,
  success: `rgba(77,204,44,1)`,
  bright: `rgba(189,134,254,1)`,
};

export const molochTheme = {
  baseFont: `'Roboto', sans-serif`,
  dataFont: `'Share Tech Mono', sans-serif`,
  baseFontColor: 'white',
  brand: 'japanese-ogre.png',
  appBackground: `rgba(0, 0, 0, 0.95)`,
  primary: `#aa174c`,
  secondary: `#aa174c`,
  tertiary: `#aa174c`,
  danger: `rgba(239,73,95,1)`,
  success: `rgba(77,204,44,1)`,
  bright: `rgba(189,134,254,1)`,
};

export const basePadding = '15px';
export const basePadding2x = `${basePadding} * 2`;
export const getAppLight = (theme) => lighten(0.1, theme.appBackground);
export const getAppDark = (theme) => darken(0.1, theme.appBackground);
export const getPrimaryHover = (theme) => darken(0.1, theme.primary);
export const getSecondaryHover = (theme) => darken(0.1, theme.secondary);
export const getTertiaryHover = (theme) => darken(0.1, theme.tertiary);
export const getDangerHover = (theme) => darken(0.1, theme.danger);

// Color Palette
export const appBackground = `#F8F8FC`;
export const appLight = lighten(0.1, appBackground);
export const appDark = darken(0.1, appBackground);
export const primary = `rgba(203,46,206,1)`;
export const secondary = `rgba(47,233,167,1)`;
export const tertiary = `rgba(239,73,123,1)`;
export const primaryHover = darken(0.1, primary);
export const secondaryHover = darken(0.1, secondary);
export const tertiaryHover = darken(0.1, tertiary);
export const danger = `rgba(239,73,95,1)`;
export const dangerHover = darken(0.1, danger);
export const success = `rgba(77,204,44,1)`;
export const bright = `rgba(189,134,254,1)`;
export const subdued = `#ccc`;

// Media Queries
export const grid = '1200px';
export const tablet = '768px';
export const phone = '640px';

export const FlashDiv = styled.div`
  opacity: 0; /* make things invisible upon start */
  top: 0px;
  animation: fadeIn, fadeOut;
  animation-fill-mode: forwards, forwards;
  animation-timing-function: ease-in, ease-out;
  animation-duration: 0.15s, 0.15s;
  animation-delay: 0s, 2s;
  animation-iteration-count: 1, 1;
  left: 50%;
  transform: translateX(-50%);
  position: fixed;
  background-color: $primary;
  color: white;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  p {
    font-weight: 900;
  }
  z-index: 99;
`;

export const ButtonPrimary = styled.button`
  color: ${primary};
  &:hover {
    color: ${primaryHover};
  }
`;
export const ButtonSecondary = styled.button`
  color: ${secondary};
  &:hover {
    color: ${secondaryHover};
  }
  &:disabled {
    color: grey;
  }
`;
export const ButtonTertiary = styled.button`
  color: ${tertiary};
  &:hover {
    color: ${tertiaryHover};
  }
`;
