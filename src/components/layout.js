import React from 'react';
import { Flex, Box, useBreakpointValue } from '@chakra-ui/react';
import DesktopNav from '../nav/desktopNav';
import '../global.css';
import Header from '../components/header';

import { useCustomTheme } from '../contexts/CustomThemeContext';
import { themeImagePath } from '../utils/metadata';

const Layout = ({ children, dao }) => {
  const { theme } = useCustomTheme();
  const mainNav = useBreakpointValue({
    lg: <DesktopNav dao={dao} />,
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
        bgImage={`url(${themeImagePath(theme.images.bgImg)})`}
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
        <Header dao={dao} />
        <Box p={6}>{children}</Box>
      </Flex>
    </Flex>
  );
};

export default Layout;
