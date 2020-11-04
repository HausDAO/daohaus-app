import React from 'react';
import {
  Flex,
  Image,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  Link,
  Box,
} from '@chakra-ui/core';

import Header from '../Shared/Header';
import SideNav from '../Shared/SideNav';
import { useTheme } from '../../contexts/PokemolContext';

const Layout = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [theme] = useTheme();

  return (
    <Flex direction='row' minH='100vh' color='white' w='100vw'>
      <Box
        position='fixed'
        w='100%'
        h='100%'
        bgImage={'url(' + theme.images.bgImg + ')'}
        bgSize='cover'
        bgPosition='center'
        zIndex='-1'
        _before={{
          display: 'block',
          content: '""',
          position: 'absolute',
          w: '100%',
          h: '100%',
          bgColor: 'background.500',
          opacity: theme.styles.bgOverlayOpacity,
          pointerEvents: 'none',
          top: '0',
          zIndex: '-1',
        }}
      />
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
        cursor='pointer'
        _hover={{ bg: 'primary.400' }}
      >
        <Flex direction='column' h='100vh' onClick={onOpen}>
          <Image src={theme.images.brandImg} w='60px' h='60px' />
        </Flex>
        <Flex direction='column' align='center'>
          {theme.daoMeta.discord !== '' ? (
            <Link mb={3} href={theme.daoMeta.discord} isExternal>
              D
            </Link>
          ) : null}
          {theme.daoMeta.medium !== '' ? (
            <Link mb={3} href={theme.daoMeta.medium} isExternal>
              M
            </Link>
          ) : null}
        </Flex>
      </Flex>
      <Drawer placement='left' isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg='primary.500' color='white' p={6}>
          <SideNav />
        </DrawerContent>
      </Drawer>

      <Flex w='100vw' ml='100px' flexDirection='column'>
        <Header></Header>
        {children}
      </Flex>
    </Flex>
  );
};

export default Layout;
