import React, { useContext, useState } from 'react';
import {
  Collapse,
  Icon,
  Flex,
  Box,
  PseudoBox,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
} from '@chakra-ui/core';

import Header from '../shared/Header';
import SideNav from '../shared/SideNav';
import { PokemolContext } from '../../contexts/PokemolContext';

const Layout = ({ children }) => {
  const [show, setShow] = useState(false);
  const { state } = useContext(PokemolContext);

  const handleToggle = () => setShow(!show);

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex direction="row" h="100vh" bg="brand.400" color="white" w="100vw">
      <PseudoBox
        h="100vh"
        d="flex"
        w="auto"
        minW="100px"
        p={5}
        direction="column"
        alignItems="start"
        justifyContent="start"
        role="group"
      >
        <Box w="60px">
          <img
            src={state.theme.images.brandImg}
            onClick={onOpen}
            width="60px"
            height="60px"
            style={{ cursor: 'pointer' }}
          />
        </Box>
      </PseudoBox>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="brand.400" color="white">
          <SideNav />
        </DrawerContent>
      </Drawer>

      <Flex direction="column" bg="background.400" w="100%">
        <Header></Header>
        {children}
      </Flex>
    </Flex>
  );
};

export default Layout;
