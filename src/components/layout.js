import React from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import { useCustomTheme } from "../contexts/CustomThemeContext";
import { useInjectedProvider } from "../contexts/InjectedProviderContext";

const Layout = ({ sideMenu, children }) => {
  const { injectedProvider } = useInjectedProvider();
  const { theme } = useCustomTheme();
  // console.log(object);
  return (
    <Grid h="100%" w="100%" templateColumns="20rem auto">
      <GridItem colSpan={1} bg={theme.colors.primary[500]}>
        {sideMenu}
      </GridItem>
      <GridItem colStart={2} colEnd={5} bg={theme.colors.background[500]}>
        <p>Account: {injectedProvider.currentProvider?.selectedAddress}</p>
        {children}
      </GridItem>
    </Grid>
  );
};

export default Layout;
