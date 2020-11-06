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
    open: { width: 420 },
    closed: { width: 120 },
  };

  const nav = {
    open: { opacity: 1, pointerEvents: 'all' },
    closed: { opacity: 0, pointerEvents: 'none' },
  };

  return (
    <Flex direction='row' minH='100vh' color='white' w='100vw'>
      <MotionFlex
        h='100vh'
        w='100%'
        p={6}
        position='fixed'
        direction='column'
        align='start'
        justifyContent='space-between'
        cursor='pointer'
        bg='primary.500'
        _hover={{ bg: 'primary.400' }}
        variants={bar}
        animate={isOpen ? 'closed' : 'open'}
        initial='open'
        zIndex='1'
      >
        <Flex direction='column' h='400px'>
          <Image
            src={theme.images.brandImg}
            w='60px'
            h='60px'
            onClick={onToggle}
          />
        </Flex>
        <MotionBox
          initial='open'
          variants={nav}
          animate={isOpen ? 'closed' : 'open'}
          position='absolute'
          ml='80px'
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

      <MotionBox
        position='fixed'
        w={
          isOpen
            ? 'calc(100% - ' + bar.closed.width + 'px)'
            : 'calc(100% - ' + bar.open.width + 'px)'
        }
        h='100vh'
        bgImage={'url(' + theme.images.bgImg + ')'}
        bgSize='cover'
        bgPosition='center'
        zIndex='-1'
        top='0'
        right='0'
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
          right: '0',
          zIndex: '-1',
        }}
      />
      <Flex
        w={
          isOpen
            ? 'calc(100% - ' + bar.closed.width + 'px)'
            : 'calc(100% - ' + bar.open.width + 'px)'
        }
        ml={isOpen ? bar.closed.width + 'px' : bar.open.width + 'px'}
        flexDirection='column'
      >
        <Header></Header>
        {children}
      </Flex>
    </Flex>
  );
};

export default Layout;
