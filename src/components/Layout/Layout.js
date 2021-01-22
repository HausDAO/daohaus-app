import React from 'react';
import { Flex, Box, useBreakpointValue } from '@chakra-ui/react';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import Header from '../Shared/Header';
import '../../global.css';

import { useTheme } from '../../contexts/CustomThemeContext';
import { themeImagePath } from '../../utils/helpers';

const Layout = ({ children }) => {
  const [theme] = useTheme();

  const mainNav = useBreakpointValue({
    base: <MobileNav />,
    sm: <MobileNav />,
    md: <MobileNav />,
    lg: <DesktopNav />,
  });

  return (
    <Flex
      direction={['column', 'column', 'column', 'row']}
      minH='100vh'
      w='100vw'
    >
      {mainNav}

      <Box
        position='fixed'
        h='100vh'
        bgImage={'url(' + themeImagePath(theme.images.bgImg) + ')'}
        bgSize='cover'
        bgPosition='center'
        zIndex='-1'
        top={0}
        right='0'
        w={['100%', null, null, 'calc(100% - 100px)']}
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
        w={['100%', null, null, 'calc(100% - 100px)']}
        ml={[0, null, null, '100px']}
        mt={['80px', null, null, '0px']}
        flexDirection='column'
      >
        <Header></Header>
        {children}
      </Flex>
    </Flex>
  );
};

export default Layout;
