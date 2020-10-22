import React, { useContext, useState } from 'react';
import { Collapse, Icon, Flex, Box } from '@chakra-ui/core';

import Header from '../shared/Header';
import SideNav from '../shared/SideNav';
import { PokemolContext } from '../../contexts/PokemolContext';

const Layout = ({ children }) => {
  const [show, setShow] = useState(false);
  const { state } = useContext(PokemolContext);

  const handleToggle = () => setShow(!show);

  console.log('state', state.theme);

  return (
    <Flex direction="row" h="100vh" bg="brand.400" color="white">
      <Box
        h="100vh"
        w="80px"
        d="flex"
        p="5"
        direction="column"
        alignItems="start"
        justifyContent="center"
      >
        {state.theme.brandImg ? (
          <img src={state.theme.brandImg} onClick={handleToggle} />
        ) : (
          <Icon name="star" onClick={handleToggle} />
        )}
      </Box>
      {show ? (
        <Box mt={200} padding="2em">
          <Box>
            <SideNav />
          </Box>
        </Box>
      ) : null}

      <Flex direction="column" bg="background.400" w="100vw">
        <Header></Header>
        {children}
      </Flex>
    </Flex>
  );
};

export default Layout;
