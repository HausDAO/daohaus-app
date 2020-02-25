import React from 'react';
import TopNav from '../shared/TopNav';
import styled from 'styled-components';
import { getAppDark, getAppLight } from '../../variables.styles';

export const StyledHeader = styled.header`
  background-color: ${(props) => getAppLight(props.theme)};
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  font-size: 1em;
  color: black;
  border-bottom: 2px solid ${(props) => getAppDark(props.theme)};
  width: calc(100% - 30px);
  padding: 0px 15px;
`;

const Header = () => {
  return (
    <StyledHeader>
      <TopNav />
    </StyledHeader>
  );
};
export default Header;
