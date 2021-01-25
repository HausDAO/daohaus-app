import React from 'react';
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
  TooltipProps,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Portal,
  forwardRef,
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
  RiTeamLine,
  RiSettings3Line,
  RiBankLine,
  RiTrophyLine,
  RiQuestionLine,
  RiFireLine,
  RiRocket2Line,
  RiSearch2Line,
} from 'react-icons/ri';
import { GiCastle } from 'react-icons/gi';
import { useTheme } from '../../contexts/CustomThemeContext';
import { themeImagePath } from '../../utils/helpers';
import { defaultSocialLinks } from '../../content/socials';

const DesktopNav = () => {
  const [dao] = useDao();
  const [theme] = useTheme();
  const [user] = useUser();
  const [memberWallet] = useMemberWallet();
  const { modals, openModal } = useModals();

  return (
    <Flex
      p={5}
      position={['relative', 'relative', 'relative', 'fixed']}
      direction='column'
      align='start'
      justifyContent='start'
      bg='primary.500'
      zIndex='1'
      w='100px'
      minH='100vh'
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
          justify={['space-between', 'space-between', 'space-between', 'start']}
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
          <Box
            w={['auto', null, null, '100%']}
            order={[3, null, null, 3]}
            mt={[0, null, null, 6]}
          >
            <ChangeDao />
          </Box>
        </Flex>
      </Flex>
      <Flex direction='column' wrap='wrap'>
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
              placement='right'
              hasArrow
            >
              <Button
                variant='sideNav'
                as={RouterLink}
                to={`/dao/${dao.address}/proposals`}
                _hover={{ backgroundColor: 'white' }}
                grow='none'
              >
                <Icon as={RiBookMarkLine} w={6} h={6} />
              </Button>
            </Tooltip>
            <Tooltip
              label={theme.daoMeta.bank}
              aria-label={theme.daoMeta.bank}
              placement='right'
              hasArrow
            >
              <Button
                variant='sideNav'
                as={RouterLink}
                to={`/dao/${dao.address}/bank`}
                _hover={{ backgroundColor: 'white' }}
                grow='none'
              >
                <Icon as={RiBankLine} w={6} h={6} />
              </Button>
            </Tooltip>
            <Tooltip
              label={theme.daoMeta.members}
              aria-label={theme.daoMeta.members}
              placement='right'
              hasArrow
            >
              <Button
                variant='sideNav'
                as={RouterLink}
                to={`/dao/${dao.address}/members`}
                _hover={{ backgroundColor: 'white' }}
              >
                <Icon as={RiTeamLine} w={6} h={6} />
              </Button>
            </Tooltip>
            <Tooltip
              label='Settings'
              aria-label='Settings'
              placement='right'
              hasArrow
            >
              <Button
                variant='sideNav'
                as={RouterLink}
                to={`/dao/${dao.address}/settings`}
                _hover={{ backgroundColor: 'white' }}
              >
                <Icon as={RiSettings3Line} w={6} h={6} />
              </Button>
            </Tooltip>
            <Tooltip
              label='Boosts'
              aria-label='Boosts'
              placement='right'
              hasArrow
            >
              <Button
                variant='sideNav'
                as={RouterLink}
                to={`/dao/${dao.address}/settings/boosts`}
                _hover={{ backgroundColor: 'white' }}
              >
                <Icon as={RiRocket2Line} w={6} h={6} />
              </Button>
            </Tooltip>
            {memberWallet?.activeMember ? (
              <Tooltip
                label='Profile'
                aria-label='Profile'
                placement='right'
                hasArrow
              >
                <Button
                  variant='sideNav'
                  as={RouterLink}
                  to={`/dao/${dao.address}/profile/${memberWallet.memberAddress}`}
                  _hover={{ backgroundColor: 'white' }}
                >
                  <Icon as={RiTrophyLine} w={6} h={6} />
                </Button>
              </Tooltip>
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
              shouldWrapChildren
            >
              <PopoverTrigger>
                <Button
                  variant='sideNav'
                  _hover={{ backgroundColor: 'white', color: 'secondary.500' }}
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

export default DesktopNav;
