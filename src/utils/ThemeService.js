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

    constructor() {
    this.baseFont = `'Roboto', sans-serif`;
    this.dataFont = `'Share Tech Mono', sans-serif`;
    this.baseFontColor = 'black';
    this.basePadding = '15px';
    this.basePadding2x = `${this.basePadding} * 2`;
    this.brand = 'japanese-ogre.png';
    
    // Color Palette
    this.appBackground = `#F8F8FC`;
    this.appLight = lighten(0.1, this.appBackground);
    this.appDark = darken(0.1, this.appBackground);
    this.primary = `rgba(203,46,206,1)`;
    this.secondary = `rgba(47,233,167,1)`;
    this.tertiary = `rgba(239,73,123,1)`;
    this.primaryHover = darken(0.1, this.primary);
    this.secondaryHover = darken(0.1, this.secondary);
    this.tertiaryHover = darken(0.1, this.tertiary);
    this.danger = `rgba(239,73,95,1)`;
    this.dangerHover = darken(0.1, this.danger);
    this.success = `rgba(77,204,44,1)`;
    this.bright = `rgba(189,134,254,1)`;
    
    // Media Queries
    this.grid = '1200px';
    this.tablet = '768px';
    this.phone = '640px';
    
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