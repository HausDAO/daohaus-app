import styled from 'styled-components';
import { lighten } from 'polished';

import {
  phone,
  getDangerHover,
  getSecondaryHover,
  getPrimaryHover,
  getTertiaryHover,
  basePadding,
} from './variables.styles';

import { Link } from 'react-router-dom';

export const ButtonButton = styled.button`
  appearance: none;
  outline: none;
  background-color: transparent;
  border: none;
  cursor: pointer;
  text-decoration: none;
  position: relative;
  transition: all 0.15s ease-in-out;
  background-color: ${(props) => props.theme.secondary};
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
    background-color: ${(props) => getSecondaryHover(props.theme)};
    color: white;
    fill: white;
  }
  svg {
    display: inline-block;
    margin: 0;
    padding: 0px;
    vertical-align: middle;
    fill: white;
    margin-right: ${(props) => (props.iconLeft ? '5px' : '0')};
    margin-left: ${(props) => (props.iconRight ? '5px' : '0')};
  }
`;

export const ButtonDiv = styled.div`
  appearance: none;
  outline: none;
  background-color: transparent;
  border: none;
  cursor: pointer;
  text-decoration: none;
  position: relative;
  transition: all 0.15s ease-in-out;
  background-color: ${(props) => props.theme.secondary};
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
    background-color: ${(props) => getSecondaryHover(props.theme)};
    color: white;
    fill: white;
  }
  svg {
    display: inline-block;
    margin: 0;
    padding: 0px;
    vertical-align: middle;
    fill: white;
    margin-right: ${(props) => (props.iconLeft ? '5px' : '0')};
    margin-left: ${(props) => (props.iconRight ? '5px' : '0')};
  }
`;

export const ButtonDivPrimary = styled(ButtonDiv)`
  color: ${(props) => props.theme.primary};
  &:hover {
    color: ${(props) => getPrimaryHover(props.theme)};
  }
`;

export const ButtonDivSecondary = styled(ButtonDiv)`
  color: ${(props) => props.theme.secondary};
  &:hover {
    color: ${(props) => getSecondaryHover(props.theme)};
  }
  &:disabled {
    color: grey;
  }
`;

export const ButtonDivTertiary = styled(ButtonDiv)`
  color: ${(props) => props.theme.tertiary};
  &:hover {
    color: ${(props) => getTertiaryHover(props.theme)};
  }
`;

export const ButtonPrimary = styled(ButtonButton)`
  background-color: ${(props) => props.theme.primary};
  &:hover {
    background-color: ${(props) => getPrimaryHover(props.theme)};
  }
`;

export const ButtonSecondary = styled(ButtonButton)`
  color: ${(props) => props.theme.secondary};
  &:hover {
    color: ${(props) => getSecondaryHover(props.theme)};
  }
  &:disabled {
    color: grey;
  }
`;

export const ButtonTertiary = styled(ButtonButton)`
  color: ${(props) => props.theme.tertiary};
  &:hover {
    color: ${(props) => getTertiaryHover(props.theme)};
  }
`;

export const ButtonBackDiv = styled(ButtonDiv)`
  margin: 0;
  padding-top: 20px;
  padding-left: 0px;
  margin-left: 0px;
  left: 0;
  text-align: left;
  background-color: transparent;
  color: ${(props) => props.theme.baseFontColor};
  svg {
    fill: ${(props) => props.theme.baseFontColor};
  }
  border-radius: 0px;
  width: auto;
  &:hover {
    margin-left: -5px;
    background-color: transparent;
  }
`;

export const LabelH5 = styled.h5`
  margin: 5px 0px;
`;

export const DataP = styled.p`
  font-family: ${(props) => props.theme.dataFont};
  font-weight: 400;
  word-break: break-all;
  margin: 0px 0px 20px 0px;
`;

export const DataDiv = styled.div`
  font-family: ${(props) => props.theme.dataFont};
  font-weight: 400;
  word-break: break-all;
  margin: 0;
  font-size: 1.5em;
`;

export const DataButton = styled.button`
  font-family: ${(props) => props.theme.dataFont};
  font-weight: 400;
  word-break: break-all;
  margin: 0;
`;

export const DataH2 = styled.h2`
  font-family: ${(props) => props.theme.dataFont};
  font-weight: 400;
  word-break: break-all;
  margin: 0px 0px 20px 0px;
`;

export const OfferDiv = styled.div`
  display: flex;
  justify-content: flex-start;
  align-content: flex-start;
  > div:not(:last-child) {
    margin-right: 25px;
  }
  h5 {
    margin: 0px;
  }
  h2 {
    margin: 0px;
  }
`;

export const FormContainer = styled.div`
  padding: ${basePadding};
  width: calc(100% - 30px);
  max-width: 340px;
  margin: 0 auto;
  .Error {
    color: red;
    font-size: 13px;
    position: relative;
    top: 20px;
    left: 20px;
    margin-bottom: 40px;
  }
`;

export const FieldContainer = styled.div` {
  position: relative;
  margin-top: 25px;
  textarea { resize: vertical; }
  label {
    pointer-events: none;
    position: absolute;
    left: 20px;
    top: 17px;
    color: ${(props) => lighten(0.1, props.theme.primary)};
    background-color: transparent;
    z-index: 7;
    transition: transform 150ms ease-out, font-size 150ms ease-out;
  }
  &.HasValue {
    label {
      transform: translateY(-75%);
      font-size: 0.75em;
    }
  }
`;

export const RiskyBizButton = styled.button`
  margin: 25px auto;
  font-weight: 500;
  background-color: ${(props) => props.theme.danger};
  &:hover {
    background-color: ${(props) => getDangerHover(props.theme)};
  }
  @media (max-width: ${phone}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    svg,
    span {
      margin: 5px auto;
    }
    border-radius: 0px;
  }
`;

export const RowDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const FlexCenterDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const BackdropOpenDiv = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  background-color: ${(props) =>
    props.blank ? 'rgba(0, 0, 0, 0)' : 'rgba(0, 0, 0, 0)'};
  pointer-events: cursor;
`;

export const BackdropDiv = styled.div`
  background-color: rgba(0, 0, 0, 0);
  transition: all 0.15s linear;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 2;
  pointer-events: none;
`;

export const ViewDiv = styled.div`
  padding-bottom: 117px;
`;

export const PadDiv = styled.div`
  padding-left: 15px;
  padding-right: 15px;
`;

export const LinkButton = styled(Link)`
  background-color: transparent;
  color: ${(props) => props.theme.primary};
  padding: 0px;
  margin: 0px;
  font-weight: bold;
  &:hover {
    background-color: transparent;
    color: ${(props) => getPrimaryHover(props.theme)};
  }
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
`;

export const ButtonLink = styled(Link)`
  appearance: none;
  outline: none;
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
  &:hover {
    background-color: ${(props) => getPrimaryHover(props.theme)};
    color: white;
  }
  svg {
    display: inline-block;
    margin: 0;
    margin-top: -3px;
    padding: 0px;
    vertical-align: middle;
    fill: white !important;
  }
`;

export const DropdownInputDiv = styled.div`
  position: relative;
  .MaxLabel {
    position: absolute;
    top: 3px;
    right: 20px;
    font-size: 0.75em;
    color: ${(props) => props.theme.primary};
    cursor: pointer;
    &:hover {
      color: ${(props) => getPrimaryHover(props.theme)};
    }
  }
  .UnlockButton {
    position: absolute;
    top: 19px;
    right: 9px;
    width: 145px;
    padding: 5px;
    outline: none;
    font-size: 0.75em;
    border-radius: 25px;
    border: 2px solid ${(props) => props.theme.primary};
    background-color: ${(props) => props.theme.primary};
    color: white;
    cursor: pointer;
    transition: all 0.15s linear;
    &:hover {
      border: 2px solid ${(props) => getPrimaryHover(props.theme)};
      background-color: ${(props) => getPrimaryHover(props.theme)};
    }
    svg {
      width: 12px;
      height: 12px;
      margin: 2px auto 0px;
    }
  }
  .TokenSelect {
    position: absolute;
    top: 19px;
    right: 9px;
    width: 100px;
    select {
      font-size: 0.75em;
      font-weight: 700;
      width: 100px;
      appearance: none;
      padding: 5px;
      border: 2px solid ${(props) => props.theme.primary};
      border-radius: 50px;
      outline: none;
      color: ${(props) => props.theme.primary};
      cursor: pointer;
      background-color: transparent;
      &:hover {
        border: 2px solid ${(props) => getPrimaryHover(props.theme)};
        color: ${(props) => getPrimaryHover(props.theme)};
      }
    }
  }
`;
