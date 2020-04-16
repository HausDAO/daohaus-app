import { lighten, darken } from 'polished';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import molochBg from './assets/themes/molochTheme/moloch__meme--trans15.png';
import molochBrand from './assets/themes/molochTheme/moloch__logo--simple--red.png';
import raidBrand from './assets/themes/raidTheme/raidguild__logo.png';
import raidBg from './assets/themes/raidTheme/raid__fantasy--bg.jpg';
export const defaultTheme = {
  baseFont: `'Roboto', sans-serif`,
  dataFont: `'Share Tech Mono', sans-serif`,
  baseFontColor: 'black',
  brand: '',
  brandBg: '',
  appBackground: `#F8F8FC`,
  primary: `rgba(203,46,206,1)`,
  secondary: `rgba(47,233,167,1)`,
  tertiary: `rgba(239,73,123,1)`,
  danger: `rgba(239,73,95,1)`,
  success: `rgba(77,204,44,1)`,
  bright: `rgba(189,134,254,1)`,
};

export const defaultDarkTheme = {
  baseFont: `'Roboto', sans-serif`,
  dataFont: `'Share Tech Mono', sans-serif`,
  baseFontColor: 'white',
  brand: '',
  brandBg: '',
  appBackground: `rgba(0, 0, 0, 0.95)`,
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
  brand: molochBrand,
  brandBg: molochBg,
  appBackground: `rgba(0, 0, 0, 0.95)`,
  primary: `#aa174c`,
  secondary: `#aa174c`,
  tertiary: `#aa174c`,
  danger: `rgba(239,73,95,1)`,
  success: `rgba(77,204,44,1)`,
  bright: `rgba(189,134,254,1)`,
};

export const raidTheme = {
  baseFont: `'Roboto', sans-serif`,
  dataFont: `'Share Tech Mono', sans-serif`,
  baseFontColor: 'white',
  brand: raidBrand,
  brandBg: raidBg,
  appBackground: `rgba(0, 0, 0, 1)`,
  primary: `#ff3864`,
  secondary: `rgba(47,233,167,1)`,
  tertiary: `rgba(239,73,123,1)`,
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
export const getBrandBg = (theme) => theme.brandBg;
export const getBrand = (theme) => theme.brand;
export const getAppBackground = (theme) => theme.appBackground;
export const getBaseFontColor = (theme) => theme.baseFontColor;

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
export const subdued = `#aaa`;

// Media Queries
export const grid = '1200px';
export const tablet = '768px';
export const phone = '640px';

// Global
export const GlobalStyle = createGlobalStyle`
  body {
    color: ${(props) => props.theme.baseFontColor};
  }
  a {
    color: ${(props) => props.theme.primary};
    text-decoration: none;
    transition: all 0.15s linear;
    vertical-align: middle;
    cursor: pointer;
    svg { fill: ${(props) => getPrimaryHover(props.theme)}; }
    &:hover {
      color: ${(props) => getPrimaryHover(props.theme)};
      svg { fill: ${(props) => getPrimaryHover(props.theme)}; }
    }
  }
  button {
    appearance: none;
    outline: none;
    background-color: transparent;
    border: none;
    cursor: pointer;
    text-decoration: none;
    position: relative;
    transition: all 0.15s ease-in-out;
    background-color: ${(props) => props.theme.primary};
    color: white;
    border-radius: 50px;
    padding: 15px 30px;
    max-width: 100%;
    display: block;
    margin: 15px 0px;
    font-size: 16px;
    text-align: center;
    font-weight: 900;
    svg {
      display: inline-block;
      margin: 0;
      margin-top: -3px;
      padding: 0px;
      vertical-align: middle;
      fill: white;
      margin-right: ${(props) => (props.iconLeft ? '5px' : '0')};
      margin-left: ${(props) => (props.iconRight ? '5px' : '0')};
    }
  }
  input,
  textarea {
    outline: none;
    appearance: none;
    border: none;
    background-color: ${(props) => getAppLight(props.theme)};
    color: ${(props) => props.theme.baseFontColor};
    border: none;
    min-width: 240px;
    width: calc(100% - 40px);
    font-size: 21px;
    padding: 20px 20px 10px 20px;
    border-radius: 35px;
    box-shadow: $shadow;
  }
`;

export const FlashDiv = styled.div`
  opacity: 0;
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
  background-color: ${(props) => props.theme.primary};
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
  color: ${(props) => props.theme.primary};
  &:hover {
    color: ${(props) => getPrimaryHover(props.theme)};
  }
`;
export const ButtonSecondary = styled.button`
  color: ${(props) => props.theme.secondary};
  &:hover {
    color: ${(props) => getSecondaryHover(props.theme)};
  }
  &:disabled {
    color: grey;
  }
`;
export const ButtonTertiary = styled.button`
  color: ${(props) => props.theme.tertiary};
  &:hover {
    color: ${(props) => getTertiaryHover(props.theme)};
  }
`;
