import React, { useState } from 'react';
import { Collapse, Icon, Flex, Box } from '@chakra-ui/core';

import Header from '../header/Header';
import SideNav from '../navigation/SideNav';

const Layout = ({ children }) => {
  const [show, setShow] = useState(false);

  const handleToggle = () => setShow(!show);

  return (
    <Flex direction="row" h="100vh" bg="brand.100" color="white">
      <Box h="100vh" w="50px">
        <Icon name="star" onClick={handleToggle} />
      </Box>
      {show ? (
        <Box mt={200} padding="2em">
          <Box>
            <SideNav />
          </Box>
        </Box>
      ) : null}

      <Flex direction="column" bg="brand.200" w="100vw">
        <Header></Header>
        {children}
      </Flex>
    </Flex>
  );
};

export default Layout;
