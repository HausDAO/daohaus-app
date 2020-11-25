import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Flex,
  Icon,
  Link,
  Button,
  ButtonGroup,
  Box,
  Spacer,
  Stack,
  IconButton,
} from '@chakra-ui/core';

import { motion } from 'framer-motion';
import { useDao, useUser } from '../../contexts/PokemolContext';
import ChangeDao from '../Shared/ChangeDao';

import Header from '../Shared/Header';

import {
  RiBookMarkLine,
  RiDiscordFill,
  RiTelegramFill,
  RiMediumFill,
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
} from 'react-icons/ri';
import { GiCastle } from 'react-icons/gi';
import { useTheme } from '../../contexts/CustomThemeContext';

const MotionBox = motion.custom(Box);
const MotionFlex = motion.custom(Flex);

const bar = {
  open: { width: 420 },
  closed: { width: 100 },
};

const nav = {
  open: {
    opacity: 1,
    pointerEvents: 'all',
    marginLeft: '25px',
    display: 'inline-block',
  },
  closed: {
    opacity: 0,
    pointerEvents: 'none',
    marginLeft: '0px',
    display: 'none',
  },
};

const navFlex = {
  open: {
    opacity: 1,
    pointerEvents: 'all',
    marginLeft: '25px',
    display: 'flex',
  },
  closed: {
    opacity: 0,
    pointerEvents: 'none',
    marginLeft: '0px',
    display: 'none',
  },
};

const navLinks = {
  open: {
    opacity: 1,
    pointerEvents: 'all',
    marginLeft: '25px',
  },
  closed: {
    opacity: 0,
    pointerEvents: 'none',
    marginLeft: '0px',
  },
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

const Layout = ({ children }) => {
  const [sideNavOpen, toggleSideNav] = useState();
  const [dao] = useDao();
  const [theme] = useTheme();
  const [user] = useUser();

  useEffect(() => {
    toggleSideNav(JSON.parse(localStorage.getItem('sideNavOpen')));
  }, []);

  const handleNavToggle = () => {
    localStorage.setItem('sideNavOpen', `${!sideNavOpen}`);
    toggleSideNav(!sideNavOpen);
  };

  console.log('sideNavOpen', sideNavOpen);

  return (
    <Flex direction='row' minH='100vh' color='white' w='100vw'>
      <MotionFlex
        initial={sideNavOpen ? 'open' : 'closed'}
        animate={sideNavOpen ? 'open' : 'closed'}
        variants={bar}
        h='100vh'
        w='100%'
        p={6}
        position='fixed'
        direction='row'
        align='start'
        justifyContent='start'
        bg='primary.500'
        zIndex='1'
        overflow='hidden'
      >
        <Flex
          direction='column'
          justify='start'
          align='start'
          h='100%'
          w='100%'
        >
          <Flex align='start' justify='start' direction='row'>
            <Box
              d='block'
              as={RouterLink}
              to={dao?.graphData ? `/dao/${dao.address}` : `/`}
              w='48px'
              h='48px'
              cursor='pointer'
              border='none'
              bg={'url(' + theme.images.brandImg + ')'}
              bgSize='cover'
              bgPosition='center'
              bgRepeat='no-repeat'
              rounded='full'
              borderWidth='2px'
              borderStyle='solid'
              borderColor='transparent'
              _hover={{ border: '2px solid ' + theme.colors.whiteAlpha[500] }}
            />
            <MotionFlex
              direction='column'
              align='start'
              justify='start'
              initial={sideNavOpen ? 'open' : 'closed'}
              animate={sideNavOpen ? 'open' : 'closed'}
              variants={navFlex}
              h='48px'
            >
              {dao?.graphData ? (
                <Link as={RouterLink} to={`/dao/${dao.address}`} fontSize='xl'>
                  {dao.name}
                </Link>
              ) : (
                <Link as={RouterLink} to={`/`} fontSize='xl'>
                  DAOhaus Hub
                </Link>
              )}
              <ChangeDao />
            </MotionFlex>
          </Flex>
          <IconButton
            variant='ghost'
            icon={sideNavOpen ? <RiMenu3Line /> : <RiArrowLeftSLine />}
            onClick={handleNavToggle}
            size='lg'
            isRound='true'
            color='secondary.500'
            mt={6}
          />
          {dao?.graphData ? (
            <Stack spacing={3} d='flex' flexDirection='column' mt='55px'>
              <Button
                variant='sideNav'
                as={RouterLink}
                to={`/dao/${dao.address}/proposals`}
                _hover={{ backgroundColor: 'white' }}
                grow='none'
              >
                <Icon as={RiBookMarkLine} w={6} h={6} />
                <MotionBox
                  initial={sideNavOpen ? 'open' : 'closed'}
                  animate={sideNavOpen ? 'open' : 'closed'}
                  variants={nav}
                  fontSize='2xl'
                  fontFamily='heading'
                >
                  {theme.daoMeta.proposals}
                </MotionBox>
              </Button>
              <Button
                variant='sideNav'
                as={RouterLink}
                to={`/dao/${dao.address}/bank`}
                _hover={{ backgroundColor: 'white' }}
                grow='none'
              >
                <Icon as={RiBankLine} w={6} h={6} />
                <MotionBox
                  initial={sideNavOpen ? 'open' : 'closed'}
                  animate={sideNavOpen ? 'open' : 'closed'}
                  variants={nav}
                  fontSize='2xl'
                  fontFamily='heading'
                >
                  {theme.daoMeta.bank}
                </MotionBox>
              </Button>
              <Button
                variant='sideNav'
                as={RouterLink}
                to={`/dao/${dao.address}/members`}
                _hover={{ backgroundColor: 'white' }}
              >
                <Icon as={RiTeamLine} w={6} h={6} />
                <MotionBox
                  initial={sideNavOpen ? 'open' : 'closed'}
                  animate={sideNavOpen ? 'open' : 'closed'}
                  variants={nav}
                  fontSize='2xl'
                  fontFamily='heading'
                >
                  {theme.daoMeta.members}
                </MotionBox>
              </Button>
              <Button
                variant='sideNav'
                as={RouterLink}
                to={`/dao/${dao.address}/settings`}
                _hover={{ backgroundColor: 'white' }}
              >
                <Icon as={RiSettings3Line} w={6} h={6} />
                <MotionBox
                  initial={sideNavOpen ? 'open' : 'closed'}
                  animate={sideNavOpen ? 'open' : 'closed'}
                  variants={nav}
                  fontSize='sm'
                  fontFamily='heading'
                >
                  Settings
                </MotionBox>
              </Button>
              <Button
                variant='sideNav'
                as={RouterLink}
                to={`/dao/${dao.address}/settings/boosts`}
                _hover={{ backgroundColor: 'white' }}
              >
                <Icon as={RiRocket2Line} w={6} h={6} />
                <MotionBox
                  initial={sideNavOpen ? 'open' : 'closed'}
                  animate={sideNavOpen ? 'open' : 'closed'}
                  variants={nav}
                  fontSize='sm'
                  fontFamily='heading'
                >
                  Boosts
                </MotionBox>
              </Button>
              {user ? (
                <Button
                  variant='sideNav'
                  as={RouterLink}
                  to={`/dao/${dao.address}/profile/${user.username}`}
                  _hover={{ backgroundColor: 'white' }}
                >
                  <Icon as={RiTrophyLine} w={6} h={6} />
                  <MotionBox
                    initial={sideNavOpen ? 'open' : 'closed'}
                    animate={sideNavOpen ? 'open' : 'closed'}
                    variants={nav}
                    fontSize='sm'
                    fontFamily='heading'
                  >
                    Stats
                  </MotionBox>
                </Button>
              ) : null}
            </Stack>
          ) : (
            <Stack spacing={3} d='flex' flexDirection='column' mt='55px'>
              <Button
                variant='sideNav'
                as={Link}
                href='https://daohaus.club'
                isExternal
                _hover={{ backgroundColor: 'white' }}
                grow='none'
              >
                <Icon as={RiBookMarkLine} w={6} h={6} />
                <MotionBox
                  initial={sideNavOpen ? 'open' : 'closed'}
                  animate={sideNavOpen ? 'open' : 'closed'}
                  variants={nav}
                  fontSize='2xl'
                  fontFamily='heading'
                >
                  Explore DAOs
                </MotionBox>
              </Button>
              <Button
                variant='sideNav'
                as={Link}
                href='https://daohaus.club/summon'
                _hover={{ backgroundColor: 'white' }}
                grow='none'
              >
                <Icon as={RiFireLine} w={6} h={6} />
                <MotionBox
                  initial={sideNavOpen ? 'open' : 'closed'}
                  animate={sideNavOpen ? 'open' : 'closed'}
                  variants={nav}
                  fontSize='2xl'
                  fontFamily='heading'
                >
                  Summon a DAO
                </MotionBox>
              </Button>
              <Button
                variant='sideNav'
                as={Link}
                href={`https://xdai.pokemol.com/dao/0x283bdc900b6ec9397abb721c5bbff5ace46e0f50`}
                isExternal
                _hover={{ backgroundColor: 'white' }}
              >
                <Icon as={RiTeamLine} w={6} h={6} />
                <MotionBox
                  initial={sideNavOpen ? 'open' : 'closed'}
                  animate={sideNavOpen ? 'open' : 'closed'}
                  variants={nav}
                  fontSize='2xl'
                  fontFamily='heading'
                >
                  HausDAO
                </MotionBox>
              </Button>
              <Button
                variant='sideNav'
                as={Link}
                href='https://daohaus.club/help'
                isExternal
                _hover={{ backgroundColor: 'white' }}
              >
                <Icon as={RiQuestionLine} w={6} h={6} />
                <MotionBox
                  initial={sideNavOpen ? 'open' : 'closed'}
                  animate={sideNavOpen ? 'open' : 'closed'}
                  variants={nav}
                  fontSize='sm'
                  fontFamily='heading'
                >
                  Help
                </MotionBox>
              </Button>
              <Button
                variant='sideNav'
                as={Link}
                href='https://daohaus.club/about'
                isExternal
                _hover={{ backgroundColor: 'white' }}
              >
                <Icon as={GiCastle} w={6} h={6} />
                <MotionBox
                  initial={sideNavOpen ? 'open' : 'closed'}
                  animate={sideNavOpen ? 'open' : 'closed'}
                  variants={nav}
                  fontSize='sm'
                  fontFamily='heading'
                >
                  About
                </MotionBox>
              </Button>
            </Stack>
          )}
          <Spacer />
          <Flex w='100%'>
            <IconButton
              icon={sideNavOpen ? <RiLinksLine /> : <RiArrowLeftSLine />}
              size='lg'
              variant='ghost'
              isRound='true'
              as={Link}
              onClick={handleNavToggle}
            />

            <MotionFlex
              direction='row'
              align='center'
              justify='start'
              initial={sideNavOpen ? 'open' : 'closed'}
              animate={sideNavOpen ? 'open' : 'closed'}
              variants={navLinks}
              w='100%'
            >
              <ButtonGroup>
                {theme.daoMeta.website !== '' && (
                  <IconButton
                    as={Link}
                    icon={<RiGlobeLine />}
                    href={theme.daoMeta.website}
                    isExternal
                    size='lg'
                    variant='link'
                    isRound='true'
                  />
                )}
                {theme.daoMeta.discord !== '' && (
                  <IconButton
                    as={Link}
                    icon={<RiDiscordFill />}
                    href={theme.daoMeta.discord}
                    isExternal
                    size='lg'
                    variant='link'
                    isRound='true'
                  />
                )}
                {theme.daoMeta.telegram !== '' && (
                  <IconButton
                    as={Link}
                    icon={<RiTelegramFill />}
                    href={theme.daoMeta.telegram}
                    isExternal
                    size='lg'
                    variant='link'
                    isRound='true'
                  />
                )}
                {theme.daoMeta.medium !== '' && (
                  <IconButton
                    as={Link}
                    icon={<RiMediumFill />}
                    href={theme.daoMeta.medium}
                    isExternal
                    size='lg'
                    variant='link'
                    isRound='true'
                  />
                )}
                {theme.daoMeta.other !== '' && (
                  <IconButton
                    as={Link}
                    icon={<RiLinksLine />}
                    href={theme.daoMeta.other}
                    isExternal
                    size='lg'
                    variant='link'
                    isRound='true'
                  />
                )}
              </ButtonGroup>
            </MotionFlex>
          </Flex>
        </Flex>
      </MotionFlex>

      <MotionBox
        position='fixed'
        initial={sideNavOpen ? 'open' : 'closed'}
        animate={sideNavOpen ? 'open' : 'closed'}
        variants={background}
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
      <MotionFlex
        width='100%'
        initial={sideNavOpen ? 'open' : 'closed'}
        animate={sideNavOpen ? 'open' : 'closed'}
        variants={layout}
        flexDirection='column'
      >
        <Header></Header>
        {children}
      </MotionFlex>
    </Flex>
  );
};

export default Layout;
