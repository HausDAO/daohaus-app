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
  IconButton,
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
          <Button
            onClick={handleNavToggle}
            order='4'
            variant='ghost'
            color='secondary.500'
          >
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
              onClick={handleNavToggle}
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
                onClick={handleNavToggle}
                _hover={{ backgroundColor: 'white' }}
                leftIcon={<RiTrophyLine />}
              >
                Profile
              </Button>
            ) : null}
          </Stack>
        ) : (
          <Stack spacing={[1, null, null, 3]} mt={[3, null, null, 12]}>
            <Button
              variant='sideNav'
              as={RouterLink}
              to='/explore'
              onClick={handleNavToggle}
              _hover={{ backgroundColor: 'white' }}
              leftIcon={<RiSearch2Line />}
            >
              Explore DAOs
            </Button>
            <Button
              variant='sideNav'
              as={RouterLink}
              to='/summon'
              onClick={handleNavToggle}
              _hover={{ backgroundColor: 'white' }}
              leftIcon={<RiFireLine />}
            >
              Summon a DAO
            </Button>
            <Button
              variant='sideNav'
              as={Link}
              href={`/dao/0x283bdc900b6ec9397abb721c5bbff5ace46e0f50`}
              onClick={handleNavToggle}
              isExternal
              _hover={{ backgroundColor: 'white' }}
              leftIcon={<RiTeamLine />}
            >
              HausDAO
            </Button>
            <Button
              variant='sideNav'
              as={Link}
              href='https://daohaus.club/help'
              onClick={handleNavToggle}
              isExternal
              _hover={{ backgroundColor: 'white' }}
              leftIcon={<RiQuestionLine />}
            >
              Help
            </Button>
            <Button
              variant='sideNav'
              as={Link}
              href='https://daohaus.club/about'
              onClick={handleNavToggle}
              isExternal
              _hover={{ backgroundColor: 'white' }}
              leftIcon={<GiCastle />}
            >
              About DAOhaus
            </Button>
          </Stack>
        )}
        <Box mt={5}>
          <Flex direction='row' align='center' justify='start'>
            {!dao.address || dao.links?.website ? (
              <IconButton
                as={Link}
                icon={<RiGlobeLine />}
                href={
                  !dao.address ? defaultSocialLinks.website : dao.links.website
                }
                isExternal
                size='lg'
                variant='link'
                isRound='true'
                onClick={handleNavToggle}
              />
            ) : null}
            {!dao.address || dao.links?.discord ? (
              <IconButton
                as={Link}
                icon={<RiDiscordFill />}
                href={
                  !dao.address ? defaultSocialLinks.discord : dao.links.discord
                }
                isExternal
                size='lg'
                variant='link'
                isRound='true'
                onClick={handleNavToggle}
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
                onClick={handleNavToggle}
              />
            ) : null}
            {!dao.address || dao.links?.medium ? (
              <IconButton
                as={Link}
                icon={<RiMediumFill />}
                href={
                  !dao.address ? defaultSocialLinks.medium : dao.links.medium
                }
                isExternal
                size='lg'
                variant='link'
                isRound='true'
                onClick={handleNavToggle}
              />
            ) : null}
            {!dao.address || dao.links?.twitter ? (
              <IconButton
                as={Link}
                icon={<RiTwitterFill />}
                href={`https://twitter.com/${
                  !dao.address ? defaultSocialLinks.twitter : dao.links.twitter
                }`}
                isExternal
                size='lg'
                variant='link'
                isRound='true'
                onClick={handleNavToggle}
              />
            ) : null}
            {!dao.address || dao.links?.other ? (
              <IconButton
                as={Link}
                icon={<RiLinksLine />}
                href={!dao.address ? defaultSocialLinks.other : dao.links.other}
                isExternal
                size='lg'
                variant='link'
                isRound='true'
                onClick={handleNavToggle}
              />
            ) : null}
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
};

export default MobileNav;
