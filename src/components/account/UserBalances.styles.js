import styled from 'styled-components';

import {
  phone,
  primary,
  getPrimaryHover,
  getAppLight,
  getDangerHover,
} from '../../variables.styles';
import { FlexCenterDiv, DataButton } from '../../App.styles';

export const WalletDiv = styled.div`
  border: 1px solid #efefef;
  border-radius: 10px;
  position: relative;
  top: -2px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  background-color: ${(props) => getAppLight(props.theme)};
  @media (max-width: ${phone}) {
    border-radius: 0px;
    border: none;
  }
  @media (min-width: ${phone}) {
    width: 60%;
    margin: 25px auto;
    position: relative;
  }
`;

export const WalletHeaderDiv = styled.div`
  height: 98px;
  border-bottom: 1px solid ${(props) => getPrimaryHover(props.theme)};
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => getPrimaryHover(props.theme)};
  padding: 0 15px;
  @media (max-width: ${phone}) {
    border-radius: 0px;
    border: none;
  }
`;

export const WalletOverlayDiv = styled(FlexCenterDiv)`
  width: 100%;
  min-height: 100%;
  position: absolute;
  z-index: 1;
  background-color: ${(props) => props.theme.primary};
  color: white;
  border: none;
  p {
    text-align: center;
  }
  @media (min-width: ${phone}) {
    border-radius: 10px;
    border: none;
  }
`;

export const WalletOverlayContentsDiv = styled(FlexCenterDiv)`
  padding: 50px;
`;

export const StatusP = styled.p`
  font-size: 0.85em;
  position: relative;
  color: ${(props) =>
    props.status === 'disconnected'
      ? props.theme.danger
      : props.theme.secondary};
  margin-left: 15px;
  margin-top: 0;
  margin-bottom: 5px;
  &:before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${(props) =>
      props.status === 'disconnected'
        ? props.theme.danger
        : props.theme.secondary};
    display: block;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    margin-left: -15px;
  }
`;

export const AddressButton = styled(DataButton)`
  margin: 0;
  padding: 0px;
  border: none;
  background: none;
  color: white;
  width: auto;
  display: flex;
  align-content: center;
  &:hover {
    color: ${(props) => props.theme.secondary};
    fill: ${(props) => props.theme.secondary};
  }
  p {
    color: white;
  }
  svg {
    display: inline-block;
    fill: ${(props) => props.theme.secondary};
    width: 18px;
    height: 18px;
    margin-left: 5px;
  }
`;

export const ActionsDropdownDiv = styled.div`
  color: ${(props) => getAppLight(props.theme)};
  position: relative;
  button {
    background-color: transparent;
    img {
      margin-left: 5px;
      vertical-align: middle;
    }
  }
`;

export const SwitchHeaderDiv = styled.div`
  width: calc(100% - 30px);
  background-color: #911094;
  display: flex;
  justify-content: flex-start;
  padding: 0px 15px;
  button {
    color: ${(props) => props.theme.secondary};
    background-color: transparent;
    border-radius: 0px;
    margin: 0;
    margin-right: 25px;
    border-bottom: 4px solid transparent;
    padding: 15px 0px;
    &:hover {
      background-color: transparent;
    }
  }
`;

export const SelectedElementButton = styled.button`
  color: ${(props) => (props.selected ? '#ffffff' : '')};
  border-bottom: ${(props) =>
    props.selected ? '4px solid' + props.theme.secondary : ''};
  background-color: ${(props) => (props.selected ? 'transparent' : '')};
  font-size: ${(props) => (props.selected ? '1em' : '')};
`;

export const ActionsDropdownContentDiv = styled.div`
  position: absolute;
  right: -15px;
  background-color: ${(props) => getAppLight(props.theme)};
  min-width: 200px;
  max-width: 100%;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.15);
  padding: 12px 16px;
  z-index: 3;
  button {
    background-color: transparent;
    color: ${primary};
    text-align: left;
    padding: 15px 0px;
    margin: 0;
    &:hover {
      color: ${(props) => getPrimaryHover(props.theme)};
    }
    &.Button--Primary {
      color: $primary;
      &:hover {
        color: $primary-hover;
      }
    }
    &.Button--Secondary {
      color: $secondary;
      &:hover {
        color: $secondary-hover;
      }
      &:disabled {
        color: grey;
      }
    }
    &.Button--Tertiary {
      color: $tertiary;
      &:hover {
        color: $tertiary-hover;
      }
    }
  }
`;

export const WalletContents = styled.div`
  min-height: 300px;
`;

export const BalancesDiv = styled.div`
  min-height: 300px;
`;

export const BalanceItemDiv = styled.div`
  display: flex;
  align-content: center;
  justify-content: space-between;
  padding: 15px 15px;
  flex-direction: column;
  background-color: $app-light;
  @media (min-width: $tablet) {
    flex-direction: column;
  }
  p {
    margin: 0;
    padding: 0px;
  }
  border-bottom: 1px solid #efefef;
  p:nth-child(1) {
    font-size: 0.85em;
    color: #333;
  }
  p:nth-child(2) {
    font-size: 1.5em;
  }
`;

export const TinyButton = styled.div`
  margin: 0;
  display: inline-block;
  font-size: 0.5em;
  padding: 7px 10px;
  vertical-align: middle;
  margin-top: -5px;
  margin-left: 10px;
  background-color: ${(props) => props.theme.danger};
  &:hover {
    background-color: ${(props) => getDangerHover(props.theme)};
  }
  span {
    color: white;
    height: 13px;
    width: 13px;
    border-radius: 50%;
    border: 1px solid white;
    font-size: 0.85em;
    float: left;
    margin-right: 5px;
  }
`;
