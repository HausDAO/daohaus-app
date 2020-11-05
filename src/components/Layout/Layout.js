import React from 'react';
import { Flex, Image, useDisclosure, Link, Box } from '@chakra-ui/core';
import { motion } from 'framer-motion';

import Header from '../Shared/Header';
import SideNav from '../Shared/SideNav';
import { useTheme } from '../../contexts/PokemolContext';

const Layout = ({ children }) => {
  const { isOpen, onToggle } = useDisclosure(false);
  const [theme] = useTheme();

  const MotionBox = motion.custom(Box);
  const MotionFlex = motion.custom(Flex);

  const bar = {
    open: { width: 450 },
    closed: { width: 100 },
  };

  const nav = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
  };

  return (
    <Flex direction='row' minH='100vh' color='white' w='100vw'>
      <MotionFlex
        h='100vh'
        p={6}
        position='relative'
        direction='column'
        align='start'
        justifyContent='space-between'
        cursor='pointer'
        bg='primary.500'
        _hover={{ bg: 'primary.400' }}
        onClick={onToggle}
        variants={bar}
        animate={isOpen ? 'open' : 'closed'}
        initial='closed'
        zIndex='1'
      >
        <Flex direction='column' h='100vh'>
          <Image src={theme.images.brandImg} w='60px' h='60px' />
        </Flex>
        <MotionBox
          initial='closed'
          variants={nav}
          animate={isOpen ? 'open' : 'closed'}
          position='absolute'
          ml={100}
        >
          <SideNav />
        </MotionBox>

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
      </MotionFlex>

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
      <Flex w='100%' flexDirection='column'>
        <Header></Header>
        {children}
      </Flex>
    </Flex>
  );
};

export default Layout;
