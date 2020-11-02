import React from 'react';
import {
  Flex,
  Box,
  Image,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
} from '@chakra-ui/core';

import Header from '../Shared/Header';
import SideNav from '../Shared/SideNav';
import { useTheme } from '../../contexts/PokemolContext';

const Layout = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [theme] = useTheme();

  return (
    <Flex direction='row' minH='100vh' bg='brand.400' color='white' w='100vw'>
      <Box
        h='100vh'
        minW='100px'
        d='flex'
        p={6}
        direction='column'
        alignItems='start'
        justifyContent='center'
        _hover={{ bg: 'brand.700' }}
      >
        <Image src={theme.images.brandImg} onClick={onOpen} size='60px' />
      </Box>
      <Drawer placement='left' isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg='brand.400' color='white' p={6} onClick={onClose}>
          <SideNav />
        </DrawerContent>
      </Drawer>

      <Flex direction='column' bg='background.400' w='100vw'>
        <Header></Header>
        {children}
      </Flex>
    </Flex>
  );
};

export default Layout;
