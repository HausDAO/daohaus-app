import styled from 'styled-components';

import { phone, primary, baseFontColor, appLight, primaryHover } from '../../variables.styles';

export const TopNavDiv = styled.div`
  position: relative;
  width: 100%;
  height: 62px;
  .Brand {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(0, -50%);
    font-weight: 900;
    color: black;
    &:hover {
      color: ${primary};
    }
    font-size: 1.5em;
    img {
      height: 48px;
    }
    @media (max-width: ${phone}) {
      font-size: 1.15em;
      max-width: 50%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  `

export const AuthDiv = styled.div`
    position: absolute;
    top: 15px;
    right: 0px;
    border: 2px solid ${baseFontColor};
    border-radius: 16px;
    padding: 5px 15px;
    background-color: ${appLight};
    transition: all 0.15s linear;
    font-weight: 900;
    z-index: 98;
  }
`

export const DropdownDiv = styled.div`
  position: relative;
  height: 0px;
  overflow: hidden;
  transition: all 0.15s linear;
`

export const DropdownOpenDiv = styled.div`

    transition: all 0.15s linear;
    height: auto;
    overflow: visible;

  
`

export const DropdownItemDiv = styled.div`

      margin: 20px 0px !important;
      display: block;

  
`
