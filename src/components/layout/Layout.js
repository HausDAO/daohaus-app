import React, { useContext, useState } from 'react';
import { Collapse, Icon, Flex, Box } from '@chakra-ui/core';

import Header from '../shared/Header';
import SideNav from '../shared/SideNav';
import { PokemolContext } from '../../contexts/PokemolContext';

const Layout = ({ children }) => {
  const [show, setShow] = useState(false);
  const { state } = useContext(PokemolContext);

  const handleToggle = () => setShow(!show);

  return (
    <Flex direction="row" h="100vh" bg="brand.400" color="white" w="100vw">
      <Box
        h="100vh"
        w="100px"
        d="flex"
        p={6}
        direction="column"
        alignItems="start"
        justifyContent="center"
        _hover={{ bg: 'brand.700' }}
      >
        <img
          src={state.theme.images.brandImg}
          onClick={handleToggle}
          w="80px"
        />
      </Box>
      {show ? (
        <Box>
          <SideNav />
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
