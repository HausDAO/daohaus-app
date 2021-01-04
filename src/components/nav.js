import React from "react";
import styled from "styled-components";
import { useInjectedProvider } from "../contexts/InjectedProviderContext";

import { getColor } from "../styles/palette";
import { widthQuery } from "../styles/responsive";
import { getTrucatedAddress } from "../utils/injected";
import Button from "./button";
// import { Web3SignIn } from "./Web3SignIn";

const NavContainer = styled.nav`
  height: 5.6rem;
  width: 100%;
  padding: 0 2.4rem;
  grid-row: 1;
  grid-column: 1/6;
  position: fixed;
  display: flex;
  align-items: center;
  top: 0;
  background-color: ${getColor("dark")};
  z-index: 30;
  /* @media ${widthQuery.tablet} {
    padding: 0 4rem;
  }
  @media ${widthQuery.mobileL} {
    padding: 0 2.4rem;
  }
  @media ${widthQuery.mobileS} {
    padding: 0 1.6rem;
  } */

  .logo-button {
    color: ${getColor("white")};
    margin-left: 1.6rem;
    font-size: 2.4rem;
    margin-right: auto;
    transform: translateY(0.2rem);
  }
  .wallet-button {
    margin-left: auto;
    margin-right: 1.6rem;
  }
`;

const Header = () => {
  const {
    requestWallet,
    disconnectDapp,
    injectedProvider,
  } = useInjectedProvider();

  // console.log(provider);
  const shortAddress = getTrucatedAddress(injectedProvider?.provider);
  return (
    <NavContainer>
      {injectedProvider ? (
        <Button
          className="wallet-button primary"
          onClick={disconnectDapp}
          content={shortAddress}
        />
      ) : (
        <Button
          content="Connect Wallet"
          className="wallet-button primary"
          onClick={requestWallet}
        />
      )}
    </NavContainer>
  );
};

export default Header;
