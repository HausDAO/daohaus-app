import React, { useState } from 'react';
import { Flex, Box, Image } from '@chakra-ui/core';

import Header from '../Shared/Header';
import SideNav from '../Shared/SideNav';
import { useTheme } from '../../contexts/PokemolContext';

const Layout = ({ children }) => {
  const [show, setShow] = useState(false);
  const [theme] = useTheme();

  const handleToggle = () => setShow(!show);

  return (
    <Flex direction="row" h="100vh" bg="brand.400" color="white" w="100vw">
      <Box
        h="100vh"
        minW="100px"
        d="flex"
        p={6}
        direction="column"
        alignItems="start"
        justifyContent="center"
        _hover={{ bg: 'brand.700' }}
      >
        <Image src={theme.images.brandImg} onClick={handleToggle} size="80px" />
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
