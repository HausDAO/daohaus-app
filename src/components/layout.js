import React from "react";
import { Button, Grid, GridItem } from "@chakra-ui/react";
import { useCustomTheme } from "../contexts/CustomThemeContext";
import { useInjectedProvider } from "../contexts/InjectedProviderContext";

const Layout = ({ sideMenu, children }) => {
  const { requestWallet, disconnectDapp, address } = useInjectedProvider();
  const { theme } = useCustomTheme();

  return (
    <Grid h="100%" w="100%" templateColumns="20rem auto">
      <GridItem colSpan={1} bg={theme.colors.primary[500]}>
        {sideMenu}
      </GridItem>
      <GridItem colStart={2} colEnd={5} bg={theme.colors.background[500]}>
        {address ? (
          <Button onClick={disconnectDapp}>{address}</Button>
        ) : (
          <Button onClick={requestWallet}>Sign In</Button>
        )}
        {children}
      </GridItem>
    </Grid>
  );
};

export default Layout;
