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
} from '@chakra-ui/react';

import { motion } from 'framer-motion';
import {
  useDao,
  useUser,
  useModals,
  useMemberWallet,
} from '../../contexts/PokemolContext';
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

const MotionBox = motion.custom(Box);
const MotionFlex = motion.custom(Flex);

const Layout = ({ children }) => {
  const [sideNavOpen, toggleSideNav] = useState();
  const [dao] = useDao();
  const [theme] = useTheme();
  const [user] = useUser();
  const [memberWallet] = useMemberWallet();
  const { modals, openModal } = useModals();

  const bar = useBreakpointValue({
    base: {
      open: {
        width: '100%',
        height: '100%',
      },
      closed: {
        width: '100%',
        height: '100px',
      },
    },
    sm: {
      open: {
        width: '100%',
        height: '100vh',
      },
      closed: {
        width: '100%',
        height: '100px',
      },
    },
    md: {
      open: {
        width: '100%',
        height: '100vh',
      },
      closed: {
        width: '100%',
        height: '100px',
      },
    },
    lg: {
      open: {
        width: '420px',
        height: '100vh',
      },
      closed: {
        width: '100px',
        height: '100vh',
      },
    },
  });

  const nav = useBreakpointValue({
    base: {
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
    },
    sm: {
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
    },
    md: {
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
    },
    lg: {
      open: {
        opacity: 1,
        pointerEvents: 'all',
        marginLeft: '25px',
        display: 'inline-block',
        width: 'auto',
      },
      closed: {
        opacity: 0,
        pointerEvents: 'none',
        marginLeft: '0px',
        display: 'none',
        width: '0px',
      },
    },
  });

  const navFlex = useBreakpointValue({
    base: {
      open: {
        opacity: 1,
        pointerEvents: 'all',
        marginLeft: '0px',
        display: 'flex',
      },
      closed: {
        opacity: 0,
        pointerEvents: 'none',
        marginLeft: '0px',
        display: 'none',
      },
    },
    sm: {
      open: {
        opacity: 1,
        pointerEvents: 'all',
        marginLeft: '0px',
        display: 'flex',
      },
      closed: {
        opacity: 0,
        pointerEvents: 'none',
        marginLeft: '0px',
        display: 'none',
      },
    },
    md: {
      open: {
        opacity: 1,
        pointerEvents: 'all',
        marginLeft: '0px',
        display: 'flex',
      },
      closed: {
        opacity: 0,
        pointerEvents: 'none',
        marginLeft: '0px',
        display: 'none',
      },
    },
    lg: {
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
    },
  });

  const navLinks = useBreakpointValue({
    base: {
      open: {
        opacity: 1,
        pointerEvents: 'all',
        marginLeft: '0px',
      },
      closed: {
        opacity: 0,
        pointerEvents: 'none',
        marginLeft: '0px',
      },
    },
    sm: {
      open: {
        opacity: 1,
        pointerEvents: 'all',
        marginLeft: '0px',
      },
      closed: {
        opacity: 0,
        pointerEvents: 'none',
        marginLeft: '0px',
      },
    },
    md: {
      open: {
        opacity: 1,
        pointerEvents: 'all',
        marginLeft: '0px',
      },
      closed: {
        opacity: 0,
        pointerEvents: 'none',
        marginLeft: '0px',
      },
    },
    lg: {
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
    },
  });

  const navButtons = useBreakpointValue({
    base: {
      open: {
        opacity: 1,
        pointerEvents: 'all',
        display: 'inline-block',
      },
      closed: {
        opacity: 0,
        pointerEvents: 'none',
        display: 'none',
      },
    },
    sm: {
      open: {
        opacity: 1,
        pointerEvents: 'all',
        display: 'inline-block',
      },
      closed: {
        opacity: 0,
        pointerEvents: 'none',
        display: 'none',
      },
    },
    md: {
      open: {
        opacity: 1,
        pointerEvents: 'all',
        display: 'inline-block',
      },
      closed: {
        opacity: 0,
        pointerEvents: 'none',
        display: 'none',
      },
    },
    lg: {
      open: {
        opacity: 1,
        pointerEvents: 'all',
        display: 'flex',
        width: 'auto',
      },
      closed: {
        opacity: 1,
        pointerEvents: 'all',
        display: 'flex',
        width: '52px',
      },
    },
  });

  const layout = useBreakpointValue({
    base: {
      open: {
        width: '100%',
        marginLeft: 0,
      },
      closed: {
        width: '100%',
        marginLeft: 0,
      },
    },
    sm: {
      open: {
        width: '100%',
        marginLeft: 0,
      },
      closed: {
        width: '100%',
        marginLeft: 0,
      },
    },
    md: {
      open: {
        width: '100%',
        marginLeft: 0,
      },
      closed: {
        width: '100%',
        marginLeft: 0,
      },
    },
    lg: {
      open: {
        width: 'calc(100% - ' + bar.open.width + ')',
        marginLeft: bar.open.width,
      },
      closed: {
        width: 'calc(100% - ' + bar.closed.width + ')',
        marginLeft: bar.closed.width,
      },
    },
  });

  useEffect(() => {
    toggleSideNav(JSON.parse(localStorage.getItem('sideNavOpen')));
  }, []);

  const handleNavToggle = () => {
    localStorage.setItem('sideNavOpen', `${!sideNavOpen}`);
    toggleSideNav(!sideNavOpen);
  };

  return (
    <Flex
      direction={['column', 'column', 'column', 'row']}
      minH='100vh'
      w='100vw'
    >
      <MotionFlex
        initial={sideNavOpen ? 'open' : 'closed'}
        animate={sideNavOpen ? 'open' : 'closed'}
        variants={bar}
        p={5}
        position={['relative', 'relative', 'relative', 'fixed']}
        direction='column'
        align='start'
        justifyContent='start'
        bg='primary.500'
        zIndex='1'
        overflow='hidden'
        overflowY='auto'
      >
        <Flex
          direction={['row', 'row', 'row', 'column']}
          justify='start'
          align={['center', 'center', 'center', 'start']}
          w='100%'
          wrap='wrap'
        >
          <Flex
            align={['center', 'center', 'center', 'start']}
            justify={[
              'space-between',
              'space-between',
              'space-between',
              'start',
            ]}
            direction='row'
            w='100%'
            wrap='wrap'
          >
            {dao?.address ? (
              <Avatar
                d='block'
                as={RouterLink}
                to={dao?.graphData ? `/dao/${dao.address}` : `/`}
                size='md'
                cursor='pointer'
                border='none'
                src={
                  dao.avatarImg
                    ? themeImagePath(dao.avatarImg)
                    : makeBlockie(dao.address)
                }
                bg={theme.colors.primary}
                borderWidth='2px'
                borderStyle='solid'
                borderColor='transparent'
                _hover={{ border: '2px solid ' + theme.colors.whiteAlpha[500] }}
                order={[1, null, null, 1]}
              />
            ) : (
              <Avatar
                d='block'
                as={RouterLink}
                to={`/`}
                size='md'
                cursor='pointer'
                border='none'
                src={BrandImg}
                bg={theme.colors.primary}
                borderWidth='2px'
                borderStyle='solid'
                borderColor='transparent'
                _hover={{ border: '2px solid ' + theme.colors.whiteAlpha[500] }}
                order={[1, null, null, 1]}
              />
            )}
            <Box
              d={['inline-block', null, null, 'none']}
              order='3'
              ml='auto'
              mr={2}
            >
              {user ? (
                <>
                  <Button
                    variant='ghost'
                    onClick={() => openModal('accountModal')}
                  >
                    <UserAvatar
                      user={user.profile ? user.profile : user}
                      hideCopy={true}
                    />
                  </Button>

                  <AccountModal isOpen={modals.accountModal} />
                </>
              ) : (
                <Web3SignIn />
              )}
            </Box>
            <MotionFlex
              direction='column'
              align='start'
              justify='start'
              initial={sideNavOpen ? 'open' : 'closed'}
              animate={sideNavOpen ? 'open' : 'closed'}
              variants={navFlex}
              h='48px'
              mt={[3, null, null, 0]}
              order={[4, null, null, 2]}
              w={['100%', null, null, 'calc(100% - 80px)']}
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
            <Box
              w={['auto', null, null, '100%']}
              order={[3, null, null, 3]}
              mt={[0, null, null, 6]}
            >
              <IconButton
                variant='ghost'
                icon={sideNavOpen ? <RiCloseLine /> : <RiMenu3Line />}
                onClick={handleNavToggle}
                size='lg'
                isRound='true'
                color='secondary.500'
              />
            </Box>
          </Flex>
        </Flex>
        <MotionFlex
          initial={sideNavOpen ? 'open' : 'closed'}
          animate={sideNavOpen ? 'open' : 'closed'}
          variants={navButtons}
          direction='column'
          wrap='wrap'
        >
          {dao?.graphData ? (
            <Stack
              spacing={[1, null, null, 3]}
              d='flex'
              mt={[3, null, null, 12]}
              flexDirection='column'
            >
              <Tooltip
                label={theme.daoMeta.proposals}
                aria-label={theme.daoMeta.proposals}
              >
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
                    fontSize={['lg', null, null, '2xl']}
                    fontFamily='heading'
                  >
                    {theme.daoMeta.proposals}
                  </MotionBox>
                </Button>
              </Tooltip>
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
                  fontSize={['lg', null, null, '2xl']}
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
                  fontSize={['lg', null, null, '2xl']}
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
              {memberWallet?.activeMember ? (
                <Button
                  variant='sideNav'
                  as={RouterLink}
                  to={`/dao/${dao.address}/profile/${memberWallet.memberAddress}`}
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
                    Profile
                  </MotionBox>
                </Button>
              ) : null}
            </Stack>
          ) : (
            <Stack
              spacing={[1, null, null, 3]}
              d='flex'
              mt={[3, null, null, 12]}
              flexDirection='column'
            >
              <Tooltip
                label='Explore DAOs'
                aria-label='Explore DAOs'
                placement='right'
                hasArrow
              >
                <Button
                  variant='sideNav'
                  as={RouterLink}
                  to='/explore'
                  _hover={{ backgroundColor: 'white' }}
                  grow='none'
                >
                  <Icon as={RiSearch2Line} w={6} h={6} />
                  <MotionBox
                    initial={sideNavOpen ? 'open' : 'closed'}
                    animate={sideNavOpen ? 'open' : 'closed'}
                    variants={nav}
                    fontSize={['lg', null, null, '2xl']}
                    fontFamily='heading'
                  >
                    Explore DAOs
                  </MotionBox>
                </Button>
              </Tooltip>
              <Tooltip
                label='Summon a DAO'
                aria-label='Summon a DAO'
                placement='right'
                hasArrow
              >
                <Button
                  variant='sideNav'
                  as={RouterLink}
                  to='/summon'
                  _hover={{ backgroundColor: 'white' }}
                  grow='none'
                >
                  <Icon as={RiFireLine} w={6} h={6} />
                  <MotionBox
                    initial={sideNavOpen ? 'open' : 'closed'}
                    animate={sideNavOpen ? 'open' : 'closed'}
                    variants={nav}
                    fontSize={['lg', null, null, '2xl']}
                    fontFamily='heading'
                  >
                    Summon a DAO
                  </MotionBox>
                </Button>
              </Tooltip>
              <Tooltip
                label='HausDAO'
                aria-label='HausDAO'
                placement='right'
                hasArrow
              >
                <Button
                  variant='sideNav'
                  as={Link}
                  href={`/dao/0x283bdc900b6ec9397abb721c5bbff5ace46e0f50`}
                  isExternal
                  _hover={{ backgroundColor: 'white' }}
                >
                  <Icon as={RiTeamLine} w={6} h={6} />
                  <MotionBox
                    initial={sideNavOpen ? 'open' : 'closed'}
                    animate={sideNavOpen ? 'open' : 'closed'}
                    variants={nav}
                    fontSize={['lg', null, null, '2xl']}
                    fontFamily='heading'
                  >
                    HausDAO
                  </MotionBox>
                </Button>
              </Tooltip>
              <Tooltip
                label='Help'
                aria-label='Help'
                placement='right'
                hasArrow
              >
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
              </Tooltip>
              <Tooltip
                label='About DAOhaus'
                aria-label='About DAOhaus'
                placement='right'
                hasArrow
              >
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
              </Tooltip>
            </Stack>
          )}
          <Spacer />
          <Flex
            w='100%'
            initial={sideNavOpen ? 'open' : 'closed'}
            animate={sideNavOpen ? 'open' : 'closed'}
            variants={navFlex}
            mt={6}
            alignSelf='flex-end'
          >
            <Tooltip
              label='Links'
              aria-label='Links'
              placement='right'
              hasArrow
            >
              <IconButton
                icon={sideNavOpen ? <RiArrowLeftSLine /> : <RiLinksLine />}
                size='lg'
                variant='ghost'
                isRound='true'
                as={Link}
                onClick={handleNavToggle}
              />
            </Tooltip>

            <MotionFlex
              direction='row'
              align='start'
              justify='start'
              initial={sideNavOpen ? 'open' : 'closed'}
              animate={sideNavOpen ? 'open' : 'closed'}
              variants={navLinks}
              w='100%'
            >
              <ButtonGroup>
                {!dao.address || dao.links?.website ? (
                  <IconButton
                    as={Link}
                    icon={<RiGlobeLine />}
                    href={
                      !dao.address
                        ? defaultSocialLinks.website
                        : dao.links.website
                    }
                    isExternal
                    size='lg'
                    variant='link'
                    isRound='true'
                  />
                ) : null}
                {!dao.address || dao.links?.discord ? (
                  <IconButton
                    as={Link}
                    icon={<RiDiscordFill />}
                    href={
                      !dao.address
                        ? defaultSocialLinks.discord
                        : dao.links.discord
                    }
                    isExternal
                    size='lg'
                    variant='link'
                    isRound='true'
                  />
                ) : null}
                {!dao.address || dao.links?.telegram ? (
                  <IconButton
                    as={Link}
                    icon={<RiTelegramFill />}
                    href={
                      !dao.address
                        ? defaultSocialLinks.telegram
                        : dao.links.telegram
                    }
                    isExternal
                    size='lg'
                    variant='link'
                    isRound='true'
                  />
                ) : null}
                {!dao.address || dao.links?.medium ? (
                  <IconButton
                    as={Link}
                    icon={<RiMediumFill />}
                    href={
                      !dao.address
                        ? defaultSocialLinks.medium
                        : dao.links.medium
                    }
                    isExternal
                    size='lg'
                    variant='link'
                    isRound='true'
                  />
                ) : null}
                {!dao.address || dao.links?.twitter ? (
                  <IconButton
                    as={Link}
                    icon={<RiTwitterFill />}
                    href={`https://twitter.com/${
                      !dao.address
                        ? defaultSocialLinks.twitter
                        : dao.links.twitter
                    }`}
                    isExternal
                    size='lg'
                    variant='link'
                    isRound='true'
                  />
                ) : null}
                {!dao.address || dao.links?.other ? (
                  <IconButton
                    as={Link}
                    icon={<RiLinksLine />}
                    href={
                      !dao.address ? defaultSocialLinks.other : dao.links.other
                    }
                    isExternal
                    size='lg'
                    variant='link'
                    isRound='true'
                  />
                ) : null}
              </ButtonGroup>
            </MotionFlex>
          </Flex>
        </MotionFlex>
      </MotionFlex>

      <MotionBox
        position='fixed'
        initial={sideNavOpen ? 'open' : 'closed'}
        animate={sideNavOpen ? 'open' : 'closed'}
        variants={layout}
        h='100vh'
        bgImage={'url(' + themeImagePath(theme.images.bgImg) + ')'}
        bgSize='cover'
        bgPosition='center'
        zIndex='-1'
        top='0'
        right='0'
        w='100%'
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
        w='100%'
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
