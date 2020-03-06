import styled from 'styled-components';

import {
  phone,
  getDangerHover,
  getSecondaryHover,
  getPrimaryHover,
  getTertiaryHover,
} from './variables.styles';

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
  color: ${(props) => props.theme.primary};
  &:hover {
    color: ${(props) => getPrimaryHover(props.theme)};
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
  color: black !important;
  svg {
    fill: black !important;
  }
  border-radius: 0px;
  width: auto;
  &:hover {
    margin-left: -5px;
  }
`;

export const DataP = styled.p`
  font-family: ${(props) => props.theme.dataFont};
  font-weight: 400;
  word-break: break-all;
  margin: 0;
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
  margin: 0;
`;

export const OfferDiv = styled.div`
  display: flex;
  justify-content: flex-start;
  align-content: flex-start;
  div:first-child {
    margin-right: 25px;
  }
  h5 {
    margin: 0px;
  }
  h2 {
    margin: 0px;
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

export const LinkButton = styled.button`
  background-color: transparent;
  color: ${(props) => props.theme.primary};
  padding: 0px;
  margin: 0px;
  &:hover {
    background-color: transparent;
    color: ${(props) => getPrimaryHover(props.theme)};
  }
`;
