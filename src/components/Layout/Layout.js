import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Flex,
  Icon,
  Link,
  Button,
  ButtonGroup,
  Box,
  Spacer,
  Stack,
  Tooltip,
  IconButton,
  useBreakpointValue,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Portal,
} from '@chakra-ui/react';

import { motion } from 'framer-motion';
import {
  useDao,
  useUser,
  useModals,
  useMemberWallet,
} from '../../contexts/PokemolContext';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import makeBlockie from 'ethereum-blockies-base64';
import ChangeDao from '../Shared/ChangeDao';
import Header from '../Shared/Header';
import { Web3SignIn } from '../Shared/Web3SignIn';
import UserAvatar from '../Shared/UserAvatar';
import AccountModal from '../Modal/AccountModal';
import BrandImg from '../../assets/Daohaus__Castle--Dark.svg';
import '../../global.css';

import {
  RiBookMarkLine,
  RiDiscordFill,
  RiTelegramFill,
  RiMediumFill,
  RiTwitterFill,
  RiGlobeLine,
  RiLinksLine,
  RiMenu3Line,
  RiTeamLine,
  RiSettings3Line,
  RiBankLine,
  RiTrophyLine,
  RiQuestionLine,
  RiFireLine,
  RiRocket2Line,
  RiArrowLeftSLine,
  RiCloseLine,
  RiSearch2Line,
} from 'react-icons/ri';
import { GiCastle } from 'react-icons/gi';
import { useTheme } from '../../contexts/CustomThemeContext';
import { themeImagePath } from '../../utils/helpers';
import { defaultSocialLinks } from '../../content/socials';

const Layout = ({ children }) => {
  const [sideNavOpen, toggleSideNav] = useState();
  const [dao] = useDao();
  const [theme] = useTheme();
  const [user] = useUser();
  const [memberWallet] = useMemberWallet();
  const { modals, openModal } = useModals();

  useEffect(() => {
    toggleSideNav(JSON.parse(localStorage.getItem('sideNavOpen')));
  }, []);

  const handleNavToggle = () => {
    localStorage.setItem('sideNavOpen', `${!sideNavOpen}`);
    toggleSideNav(!sideNavOpen);
  };

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
        top='0'
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
        flexDirection='column'
      >
        <Header></Header>
        {children}
      </Flex>
    </Flex>
  );
};

export default Layout;
