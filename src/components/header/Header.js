import React, { useContext } from 'react';
import TopNav from '../shared/TopNav';
import styled from 'styled-components';
import { DaoDataContext } from '../../contexts/Store';

export const StyledBanner = styled.header`
  background-color: rgb(16, 21, 61);
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1em;
  width: calc(100% - 30px);
  padding: 0px 15px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.05);
  h1 {
    color: white;
  }
  a {
    font-size: 20px;
  }
`;

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
  const [daoData] = useContext(DaoDataContext);
  return (
    <>
      {daoData && daoData.version !== 1 ? (
        <StyledBanner>
          <h1>There is a new version of the Pokemol DAO interface!</h1>
          <p className="DaoText">
            <a href="https://app.daohaus.club/">
              Use it now at https://app.daohaus.club/
            </a>
          </p>
        </StyledBanner>
      ) : null}
      <StyledHeader>
        <TopNav />
      </StyledHeader>
    </>
  );
};
export default Header;
