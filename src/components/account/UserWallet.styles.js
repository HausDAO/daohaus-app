import styled from 'styled-components';
import { phone, getAppLight, getPrimaryHover } from '../../variables.styles';

export const UserWalletDiv = styled.div`
  position: relative;
`;

export const WalletDiv = styled.div`
  border: none;
  border-radius: 10px;
  position: relative;
  top: -2px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  background-color: ${(props) => getAppLight(props.theme)};
  @media (max-width: ${phone}) {
    border-radius: 0px;
    border: none;
  }
`;

export const WalletHeaderDiv = styled.div`
  height: 98px;
  border-bottom: 1px solid ${(props) => getPrimaryHover(props.theme)};
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-between;
  background-color: ${(props) => getPrimaryHover(props.theme)};
  @media (max-width: ${phone}) {
    border-radius: 0px;
    border: none;
  }
`;

export const WalletInfoAddressButton = styled.button`
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
    color: ${(props) => props.theme.baseFontColor};
  }
  svg {
    display: inline-block;
    fill: ${(props) => props.theme.secondary};
    width: 18px;
    height: 18px;
    margin-left: 5px;
  }
`;
