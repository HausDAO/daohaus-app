import React from 'react';
import {
  Flex,
  Image,
  useDisclosure,
  Link,
  Box,
  IconButton,
} from '@chakra-ui/core';
import { motion } from 'framer-motion';

import Header from '../Shared/Header';
import SideNav from '../Shared/SideNav';
import { useTheme } from '../../contexts/CustomThemeContext';
import { RiArrowLeftSLine } from 'react-icons/ri';

const Layout = ({ children }) => {
  const { isOpen, onToggle } = useDisclosure(false);
  const [theme] = useTheme();
  // const [dao]

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
        animate={isOpen ? 'closed' : 'open'}
        initial='open'
        zIndex='1'
        transition={{ ease: 'easeInOut', duration: 0.15 }}
      >
        <Flex direction='column' h='400px'>
          <Image
            src={theme.images.brandImg}
            w='60px'
            h='60px'
            onClick={onToggle}
            cursor='pointer'
          />
        </Flex>
        <MotionBox
          initial='open'
          variants={nav}
          animate={isOpen ? 'closed' : 'open'}
          position='absolute'
          ml='80px'
          transition={{ ease: 'easeInOut', duration: 0.15 }}
        >
          <MotionBox
            animate={isOpen ? 'closed' : 'open'}
            variants={nav}
            position='absolute'
            top='6px'
            right='-55px'
          >
            <IconButton
              onClick={onToggle}
              aria-label='Close Menu'
              colorScheme='secondary'
              variant='outline'
              size='xs'
              icon={<RiArrowLeftSLine />}
            />
          </MotionBox>
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
        initial='open'
        variants={background}
        animate={isOpen ? 'closed' : 'open'}
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
        animate={isOpen ? 'closed' : 'open'}
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
