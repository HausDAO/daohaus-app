import { lighten, darken } from 'polished';
import styled from 'styled-components';

export class ThemeService {

  baseFont;
  dataFont;
  baseFontColor;
  basePadding;
  basePadding2x;
  brand;

  appBackground;
  appLight;
  appDark;
  primary;
  secondary;
  tertiary;
  primaryHover;
  secondaryHover;
  tertiaryHover;
  danger;
  dangerHover;
  success;
  bright;

  grid;
  tablet;
  phone;

  FlashDiv;
  ButtonPrimary;
  ButtonSecondary;
  ButtonTertiary;

  constructor(
    primary = `rgba(203,46,206,1)`,
    secondary = `rgba(47,233,167,1)`,
    tertiary = `rgba(239,73,123,1)`,
    danger = `rgba(239,73,95,1)`,
    success = `rgba(77,204,44,1)`,
    appBackground = `#F8F8FC`) {
    this.baseFont = `'Roboto', sans-serif`;
    this.dataFont = `'Share Tech Mono', sans-serif`;
    this.baseFontColor = 'black';
    this.basePadding = '15px';
    this.basePadding2x = `${this.basePadding} * 2`;
    // this.brand = 'japanese-ogre.png';

    // Color Palette
    this.appBackground = appBackground;
    this.appLight = lighten(0.1, this.appBackground);
    this.appDark = darken(0.1, this.appBackground);
    this.primary = primary; // ;
    this.secondary = secondary;
    this.tertiary = tertiary;
    this.primaryHover = darken(0.1, this.primary);
    this.secondaryHover = darken(0.1, this.secondary);
    this.tertiaryHover = darken(0.1, this.tertiary);
    this.danger = danger;
    this.dangerHover = darken(0.1, this.danger);
    this.success = success;
    this.bright = `rgba(189,134,254,1)`;

    this.shadow = `0px 0px 10px ${appBackground}`;

    // Media Queries
    this.grid = '1200px';
    this.tablet = '768px';
    this.phone = '640px';

    this.StyledA = styled.a`
  color: ${this.primary};
  fill: ${this.primary};
  text-decoration: none;
  transition: all 0.15s linear;
  vertical-align: middle;
  cursor: pointer;
  svg {
    display: inline-block;
    margin: 0;
    padding: 0px;
    vertical-align: middle;
    width: 24px;
    height: 24px;
    margin-top: -3px;
    &.IconLeft {
      margin-right: 5px;
    }
    &.IconRight {
      margin-left: 5px;
    }
  }
  &:hover {
    color: ${this.primaryHover};
    fill: ${this.primaryHover};
  }
`

this.StyledButton = styled.a`

  // Reset
  appearance: none;
  outline: none;
  background-color: transparent;
  border: none;
  cursor: pointer;
  text-decoration: none;
  position: relative;
  // Style
  transition: all 0.15s ease-in-out;
  background-color: ${this.secondary};
  color: white;
  border-radius: 50px;
  padding: 15px 30px;
  max-width: 100%;
  display: block;
  margin: 15px 0px;
  font-size: 16px;
  text-align: center;
  font-weight: 900;
  &:hover {
    background-color: ${this.secondaryHover};
    color: white;
    fill: white;
  }
  &.Disabled {
    opacity: 0.5;
  }
  &.Back {
    margin: 0;
    padding-top: 20px;
    padding-left: 0px;
    margin-left: 0px;
    left: 0;
    text-align: left;
    background-color: transparent;
    color: black !important;
    svg {
      fill: black !important;
    }
    border-radius: 0px;
    width: auto;
    &:hover {
      margin-left: -5px;
    }
  }
  svg {
    display: inline-block;
    margin: 0;
    padding: 0px;
    vertical-align: middle;
    fill: white;
    &.IconLeft {
      margin-right: 5px;
    }
    &.IconRight {
      margin-left: 5px;
    }
  }
  &--Tertiary {
    background-color: ${this.tertiary};
    &:hover {
      background-color: ${this.tertiaryHover};
    }
  }
  &--Primary {
    background-color: $primary;
    &:hover {
      background-color: $primary-hover;
    }
  }
  &--Cancel {
    background-color: transparent;
    color: ${this.primary};
    border: 2px solid ${this.primary};
    &:hover {
      color: ${this.primaryHover};
      border-color: ${this.primaryHover};
      background-color: transparent;
    }
  }
  &--Input {
    background-color: $app-light;
    min-width: 300px;
    border-radius: 30px;
    padding: 15px;
    padding-right: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: ${this.primary};
    box-shadow: $shadow;
    &.Verified,
    &.Verified:hover {
      background-color: white;
      color: ${this.success};
      svg {
        fill: ${this.success};
      }
    }
    svg {
      height: 24px;
      fill: ${this.primary};
      margin-right: 5px;
    }
    &:hover {
      color: ${this.primaryHover};
      background-color: $app-light;
      fill: ${this.primaryHover};
    }
  }
  .AddItem {
    fill: ${this.primary};
    position: absolute;
    right: 15px;
  }
`

// .LinkButton {
//   background-color: transparent;
//   color: $primary;
//   padding: 0px;
//   margin: 0px;
//   &:hover {
//     background-color: transparent;
//     color: $primary-hover;
//   }
// }

// button.Tab {
//   background-color: transparent;
//   font-size: 1em;
// }

// .ButtonGroup {
//   display: flex;
//   flex-direction: row;
//   flex-wrap: wrap;
//   align-items: center;
//   justify-content: space-between;
// }


    this.FlashDiv = styled.div`
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

    this.ButtonPrimary = styled.button`
      color: ${this.primary};
      &:hover {
        color: ${this.primaryHover};
      }
    `;

    this.ButtonSecondary = styled.button`
      color: ${this.secondary};
      &:hover {
        color: ${this.secondaryHover};
      }
      &:disabled {
        color: grey;
      }
    `;

    this.ButtonTertiary = styled.button`
      color: ${this.tertiary};
      &:hover {
        color: ${this.tertiaryHover};
      }
    `;
  }

}