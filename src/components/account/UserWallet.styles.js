import styled from 'styled-components';
import { secondary } from '../../variables.styles';

export const UserWalletDiv = styled.div`
  position: relative;
`;

export const WalletDiv = styled.div`
  border: 1px solid #efefef;
  border-radius: 10px;
  position: relative;
  top: -2px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  background-color: $app-light;
  @media (max-width: $phone) {
    border-radius: 0px;
    border: none;
  }
`;

export const WalletHeaderDiv = styled.div`
  height: 98px;
  border-bottom: 1px solid $primary-hover;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-between;
  background-color: $primary-hover;
  @media (max-width: $phone) {
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
    color: ${secondary};
    fill: ${secondary};
  }
  p {
    color: white;
  }
  svg {
    display: inline-block;
    fill: ${secondary};
    width: 18px;
    height: 18px;
    margin-left: 5px;
  }
`;
