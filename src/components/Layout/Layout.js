import React from 'react';
import {
  Flex,
  Image,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  Link,
} from '@chakra-ui/core';

import Header from '../Shared/Header';
import SideNav from '../Shared/SideNav';
import { useTheme } from '../../contexts/PokemolContext';

const Layout = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [theme] = useTheme();

  return (
    <Flex
      direction='row'
      minH='100vh'
      bg='background.500'
      color='white'
      w='100vw'
    >
      <Flex
        h='100vh'
        minW='100px'
        w='100px'
        p={6}
        position='fixed'
        direction='column'
        align='center'
        justifyContent='space-between'
        bg='primary.500'
        _hover={{ bg: 'primary.400' }}
      >
        <Image src={theme.images.brandImg} onClick={onOpen} w='60px' h='60px' />
        <Flex direction='column' align='center'>
          <Link mb={3}>M</Link>
          <Link mb={3}>T</Link>
        </Flex>
      </Flex>
      <Drawer placement='left' isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg='primary.500' color='white' p={6}>
          <SideNav />
        </DrawerContent>
      </Drawer>

      <Flex
        direction='column'
        // bg={theme.colors.background[500]}
        bgImage={'url(' + theme.images.bgImg + ')'}
        bgSize='cover'
        bgPosition='center'
        //bg='background.500'
        w='100vw'
        ml='100px'
      >
        <Header></Header>
        {children}
      </Flex>
    </Flex>
  );
};

export default Layout;
