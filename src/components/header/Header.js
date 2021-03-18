import React, { useContext } from 'react';
import TopNav from '../shared/TopNav';
import styled from 'styled-components';
import { DaoDataContext } from '../../contexts/Store';

export const StyledBanner = styled.header`
  background-color: rgb(16, 21, 61);
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: calc(100% - 30px);
  padding: 25px 15px;
  p {
    color: white;
    margin: 0;
    font-size: 21px;
    span {
      color: rgba(255, 255, 2550.85);
    }
  }
`;

export const StyledHeader = styled.header`
  background-color: ${(props) => props.theme.appBackground};
  height: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  font-size: 1em;
  width: calc(100% - 30px);
  padding: 0px 15px;
`;

const Header = () => {
  const [daoData] = useContext(DaoDataContext);
  return (
    <>
      {daoData && daoData.version !== 1 ? (
        <StyledBanner>
          <p>
            Pokemol has been rebuilt from the ground up as part of DAOhaus V2.
          </p>
          <p>
            <a href="https://app.daohaus.club/">
              Use it now at -> https://app.daohaus.club/
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
