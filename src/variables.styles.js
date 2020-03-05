import { lighten, darken } from 'polished';
import styled from 'styled-components';

export const baseFont = `'Roboto', sans-serif`;
export const dataFont = `'Share Tech Mono', sans-serif`;
export const baseFontColor = 'black';
export const basePadding = '15px';
export const basePadding2x = `${basePadding} * 2`;
export const brand = 'japanese-ogre.png';

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
  // specific styles
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
