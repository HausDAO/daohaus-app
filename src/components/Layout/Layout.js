import React from 'react';
import { Flex, Icon, Image, Link, Box, IconButton } from '@chakra-ui/core';

import { motion } from 'framer-motion';

import Header from '../Shared/Header';
import SideNav from '../Shared/SideNav';

import {
  RiArrowLeftSLine,
  RiDiscordFill,
  RiTelegramFill,
  RiMediumFill,
  RiGlobeLine,
  RiLinksLine,
} from 'react-icons/ri';
import { useTheme, useSideNavToggle } from '../../contexts/CustomThemeContext';

const Layout = ({ children }) => {
  const [sideNavOpen, toggleSideNav] = useSideNavToggle();
  const [theme] = useTheme();

  const MotionBox = motion.custom(Box);
  const MotionFlex = motion.custom(Flex);

  const bar = {
    open: { width: 420 },
    closed: { width: 100 },
  };

  const nav = {
    open: { opacity: 1, pointerEvents: 'all' },
    closed: { opacity: 0, pointerEvents: 'none' },
  };

  const background = {
    open: {
      width: 'calc(100% - ' + bar.open.width + 'px)',
      marginLeft: bar.open.width + 'px',
    },
    closed: {
      width: 'calc(100% - ' + bar.closed.width + 'px)',
      marginLeft: bar.closed.width + 'px',
    },
  };

  const layout = {
    open: {
      width: 'calc(100% - ' + bar.open.width + 'px)',
      marginLeft: bar.open.width + 'px',
    },
    closed: {
      width: 'calc(100% - ' + bar.closed.width + 'px)',
      marginLeft: bar.closed.width + 'px',
    },
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
        bg='primary.500'
        variants={bar}
        animate={sideNavOpen ? 'closed' : 'open'}
        initial='open'
        zIndex='1'
        transition={{ ease: 'easeInOut', duration: 0.15 }}
      >
        <Flex direction='column' h='400px'>
          <Image
            src={theme.images.brandImg}
            w='60px'
            h='60px'
            onClick={toggleSideNav}
            cursor='pointer'
            border='none'
          />
        </Flex>
        <MotionBox
          initial='open'
          variants={nav}
          animate={sideNavOpen ? 'closed' : 'open'}
          position='absolute'
          ml='80px'
          transition={{ ease: 'easeInOut', duration: 0.15 }}
        >
          <MotionBox
            animate={sideNavOpen ? 'closed' : 'open'}
            variants={nav}
            position='absolute'
            top='6px'
            right='-55px'
          >
            <IconButton
              onClick={toggleSideNav}
              aria-label='Close Menu'
              variant='outline'
              size='xs'
              icon={<RiArrowLeftSLine />}
            />
          </MotionBox>
          <SideNav />
        </MotionBox>

        <Flex direction='column' align='start' justify='start' w='100%'>
          {theme.daoMeta.website !== '' && (
            <Link href={theme.daoMeta.website} isExternal fontSize='xl'>
              <Icon as={RiGlobeLine} />
            </Link>
          )}
          {theme.daoMeta.discord !== '' && (
            <Link href={theme.daoMeta.discord} isExternal fontSize='xl'>
              <Icon as={RiDiscordFill} />
            </Link>
          )}
          {theme.daoMeta.telegram !== '' && (
            <Link href={theme.daoMeta.telegram} isExternal fontSize='xl'>
              <Icon as={RiTelegramFill} />
            </Link>
          )}
          {theme.daoMeta.medium !== '' && (
            <Link href={theme.daoMeta.medium} isExternal fontSize='xl'>
              <Icon as={RiMediumFill} />
            </Link>
          )}
          {theme.daoMeta.other !== '' && (
            <Link href={theme.daoMeta.other} isExternal fontSize='xl'>
              <Icon as={RiLinksLine} />
            </Link>
          )}
        </Flex>
      </MotionFlex>

      <MotionBox
        position='fixed'
        initial='open'
        variants={background}
        animate={sideNavOpen ? 'closed' : 'open'}
        h='100vh'
        bgImage={'url(' + theme.images.bgImg + ')'}
        bgSize='cover'
        bgPosition='center'
        zIndex='-1'
        top='0'
        right='0'
        transition={{ ease: 'easeInOut', duration: 0.15 }}
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
      <MotionFlex
        width='100%'
        initial='open'
        variants={layout}
        animate={sideNavOpen ? 'closed' : 'open'}
        flexDirection='column'
        transition={{ ease: 'easeInOut', duration: 0.15 }}
      >
        <Header></Header>
        {children}
      </MotionFlex>
    </Flex>
  );
};

export default Layout;
