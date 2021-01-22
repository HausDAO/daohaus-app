import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Flex,
  Icon,
  Link,
  Button,
  Box,
  Stack,
  Tooltip,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Portal,
} from '@chakra-ui/react';

import {
  useDao,
  useUser,
  useModals,
  useMemberWallet,
} from '../../contexts/PokemolContext';
import makeBlockie from 'ethereum-blockies-base64';
import ChangeDao from '../Shared/ChangeDao';
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
  RiSearch2Line,
  RiCloseLine,
} from 'react-icons/ri';
import { GiCastle } from 'react-icons/gi';
import { useTheme } from '../../contexts/CustomThemeContext';
import { themeImagePath } from '../../utils/helpers';
import { defaultSocialLinks } from '../../content/socials';

const MobileNav = () => {
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

  return (
    <Flex
      p={5}
      position='absolute'
      direction='column'
      align='start'
      justifyContent='start'
      bg='primary.500'
      zIndex='1'
      w='100%'
      minH='80px'
      overflow='hidden'
    >
      <Flex direction='row' justify='start' align='center' w='100%' wrap='wrap'>
        <Flex
          align='center'
          justify='space-between'
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
          <Box order={2} ml={3}>
            <ChangeDao />
          </Box>
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
          <Button onClick={handleNavToggle} order='4'>
            <Icon as={sideNavOpen ? RiCloseLine : RiMenu3Line} />
          </Button>
        </Flex>
      </Flex>
      <Flex
        direction='column'
        wrap='wrap'
        h={sideNavOpen ? '100vh' : '0px'}
        transition='all .25s ease-in-out'
        overflowY='auto'
      >
        {dao?.graphData ? (
          <Stack
            spacing={[1, null, null, 3]}
            d='flex'
            mt={[3, null, null, 12]}
            flexDirection='column'
          >
            <Button
              variant='sideNav'
              as={RouterLink}
              to={`/dao/${dao.address}/proposals`}
              _hover={{ backgroundColor: 'white' }}
              onClick={handleNavToggle}
              leftIcon={<RiBookMarkLine />}
            >
              {theme.daoMeta.proposals}
            </Button>
            <Button
              variant='sideNav'
              as={RouterLink}
              to={`/dao/${dao.address}/bank`}
              _hover={{ backgroundColor: 'white' }}
              onClick={handleNavToggle}
              leftIcon={<RiBankLine />}
            >
              {theme.daoMeta.bank}
            </Button>
            <Button
              variant='sideNav'
              as={RouterLink}
              to={`/dao/${dao.address}/members`}
              _hover={{ backgroundColor: 'white' }}
              onClick={handleNavToggle}
              leftIcon={<RiTeamLine />}
            >
              {theme.daoMeta.members}
            </Button>
            <Button
              variant='sideNav'
              as={RouterLink}
              to={`/dao/${dao.address}/settings`}
              _hover={{ backgroundColor: 'white' }}
              onClick={handleNavToggle}
              leftIcon={<RiSettings3Line />}
            >
              Settings
            </Button>
            <Button
              variant='sideNav'
              as={RouterLink}
              to={`/dao/${dao.address}/settings/boosts`}
              _hover={{ backgroundColor: 'white' }}
              leftIcon={<RiRocket2Line />}
            >
              Boosts
            </Button>
            {memberWallet?.activeMember ? (
              <Button
                variant='sideNav'
                as={RouterLink}
                to={`/dao/${dao.address}/profile/${memberWallet.memberAddress}`}
                _hover={{ backgroundColor: 'white' }}
                leftIcon={<RiTrophyLine />}
              >
                Profile
              </Button>
            ) : null}
          </Stack>
        ) : (
          <Stack spacing={[1, null, null, 3]} mt={[3, null, null, 12]}>
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
              </Button>
            </Tooltip>
            <Tooltip label='Help' aria-label='Help' placement='right' hasArrow>
              <Button
                variant='sideNav'
                as={Link}
                href='https://daohaus.club/help'
                isExternal
                _hover={{ backgroundColor: 'white' }}
              >
                <Icon as={RiQuestionLine} w={6} h={6} />
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
              </Button>
            </Tooltip>
          </Stack>
        )}
        <Box>
          <Popover placement='right' w='auto'>
            <Tooltip
              label='Community Links'
              aria-label='Community Links'
              placement='right'
              hasArrow
            >
              <PopoverTrigger>
                <Button
                  variant='sideNav'
                  _hover={{ backgroundColor: 'white' }}
                  mt={3}
                >
                  <Icon as={RiLinksLine} w={6} h={6} />
                </Button>
              </PopoverTrigger>
            </Tooltip>
            <Portal>
              <PopoverContent w='auto'>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody w='auto'>
                  <Flex direction='row' align='center' justify='start'>
                    {!dao.address || dao.links?.website ? (
                      <Tooltip
                        label='Website'
                        aria-label='Website'
                        placement='top'
                        hasArrow
                      >
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
                      </Tooltip>
                    ) : null}
                    {!dao.address || dao.links?.discord ? (
                      <Tooltip
                        label='Discord'
                        aria-label='Discord'
                        placement='top'
                        hasArrow
                      >
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
                      </Tooltip>
                    ) : null}
                    {!dao.address || dao.links?.telegram ? (
                      <Tooltip
                        label='Telegram'
                        aria-label='Telegram'
                        placement='top'
                        hasArrow
                      >
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
                      </Tooltip>
                    ) : null}
                    {!dao.address || dao.links?.medium ? (
                      <Tooltip
                        label='Blog'
                        aria-label='Blog'
                        placement='top'
                        hasArrow
                      >
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
                      </Tooltip>
                    ) : null}
                    {!dao.address || dao.links?.twitter ? (
                      <Tooltip
                        label='Twitter'
                        aria-label='Twitter'
                        placement='top'
                        hasArrow
                      >
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
                      </Tooltip>
                    ) : null}
                    {!dao.address || dao.links?.other ? (
                      <Tooltip
                        label='Other'
                        aria-label='Other'
                        placement='top'
                        hasArrow
                      >
                        <IconButton
                          as={Link}
                          icon={<RiLinksLine />}
                          href={
                            !dao.address
                              ? defaultSocialLinks.other
                              : dao.links.other
                          }
                          isExternal
                          size='lg'
                          variant='link'
                          isRound='true'
                        />
                      </Tooltip>
                    ) : null}
                  </Flex>
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
        </Box>
      </Flex>
    </Flex>
  );
};

export default MobileNav;
