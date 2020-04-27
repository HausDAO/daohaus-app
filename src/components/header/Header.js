import React from 'react';
import TopNav from '../shared/TopNav';
import styled from 'styled-components';

export const StyledHeader = styled.header`
  background-color: ${(props) => props.theme.appBackground};
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  font-size: 1em;
  width: calc(100% - 30px);
  padding: 0px 15px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.05);
`;

const Header = () => {
  return (
    <StyledHeader>
      <TopNav />
    </StyledHeader>
  );
};
export default Header;
