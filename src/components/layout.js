import React from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import { useCustomTheme } from "../contexts/CustomThemeContext";

const Layout = ({ sideMenu, children }) => {
  const { theme } = useCustomTheme();

  return (
    <Grid h="100%" w="100%" templateColumns="20rem auto">
      <GridItem colSpan={1} bg={theme.colors.primary[500]}>
        {sideMenu}
      </GridItem>
      <GridItem colStart={2} colEnd={5} bg={theme.colors.background[500]}>
        {children}
      </GridItem>
    </Grid>
  );
};

export default Layout;
