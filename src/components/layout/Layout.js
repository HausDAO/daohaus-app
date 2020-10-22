import React, { useState } from 'react';
import { Collapse, Button, Flex, Box } from '@chakra-ui/core';

import Header from '../header/Header';

const Layout = ({ children }) => {
  const [show, setShow] = useState(false);

  const handleToggle = () => setShow(!show);

  return (
    <Flex direction="row" h="100vh" bg="brand.100" color="white">
      <Box h="100vh">
        <Button variantColor="blue" onClick={handleToggle}>
          ICON
        </Button>
      </Box>
      <Collapse mt={200} isOpen={show}>
        <Box>
          <div>side nav</div>
        </Box>
      </Collapse>
      <Flex direction="column" bg="brand.200" w="100vw">
        <Header></Header>
        {children}
      </Flex>
    </Flex>
  );
};

export default Layout;
