import React, { useState } from 'react';
import { Collapse, Button, Flex } from '@chakra-ui/core';

import Header from '../header/Header';

const Layout = ({ children }) => {
  const [show, setShow] = useState(false);

  const handleToggle = () => setShow(!show);

  return (
    <Flex direction="row">
      <Button variantColor="blue" onClick={handleToggle}>
        ICON
      </Button>
      <Collapse mt={200} isOpen={show}>
        <div>side nav</div>
      </Collapse>
      <Flex direction="column">
        <Header></Header>
        {children}
      </Flex>
    </Flex>
  );
};

export default Layout;
