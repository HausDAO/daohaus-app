import React from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { Stack, Link, Box, Flex } from '@chakra-ui/core';

import { useDao, useRefetchQuery } from '../../contexts/PokemolContext';
import { useTheme } from '../../contexts/CustomThemeContext';
import BrandOverride from '../../assets/themes/raidTheme/raidguild__swords.svg';
import BgOverride from '../../assets/themes/raidTheme/raid__fantasy--bg.jpg';
import { PrimaryButton, SecondaryButton } from '../../themes/theme';
import ChangeDao from './ChangeDao';

const SideNav = () => {
  const [theme, setTheme] = useTheme();
  const [dao] = useDao();
  const history = useHistory();
  const [, updateRefetchQuery] = useRefetchQuery();

  const setLocalTheme = () => {
    setTheme({
      primary500: '#e50651',
      secondary500: '#6153ff',
      bg500: '#121212',
      brandImg: BrandOverride,
      bgImg: BgOverride,
      bgOverlayOpacity: '0.5',
      primaryFont: 'Space Mono', // only temporary
      bodyFont: 'Rubik',
      daoMeta: {
        proposals: 'Quests',
        proposal: 'Quest',
        bank: 'Inventory',
        members: 'Players',
        member: 'Player',
        discord: 'https://discord.gg/WqwQGgeeFd',
        medium: '',
        telegram: '',
        website: '',
        other: '',
      },
    });
  };

  const setDefault = () => {
    setTheme();
  };

  return (
    <Box>
      <>
        {dao?.graphData ? (
          <>
            <Flex direction='row' justify='start' align='start'>
              <Flex direction='column' align='start' justify='start'>
                <Link as={RouterLink} to={`/dao/${dao.address}`} fontSize='xl'>
                  {dao.name}
                </Link>
                <ChangeDao />
              </Flex>
            </Flex>
            <Stack spacing={3} mt='125px' w='200px' pr={1}>
              <Box
                fontSize='xs'
                fontFamily={theme.fonts.heading}
                cursor='pointer'
                onClick={() => history.push('/')}
              >
                Main Menu
              </Box>
              <Link to={`/dao/${dao.address}/proposals`} as={RouterLink}>
                <Box fontSize='2xl' fontFamily={theme.fonts.heading}>
                  {theme.daoMeta.proposals}
                </Box>
              </Link>
              <Link to={`/dao/${dao.address}/bank`} as={RouterLink}>
                <Box fontSize='2xl' fontFamily={theme.fonts.heading}>
                  {theme.daoMeta.bank}
                </Box>
              </Link>
              <Link to={`/dao/${dao.address}/members`} as={RouterLink}>
                <Box fontSize='2xl' fontFamily={theme.fonts.heading}>
                  {theme.daoMeta.members}
                </Box>
              </Link>
              <Link to={`/dao/${dao.address}/settings/boosts`} as={RouterLink}>
                <Box fontSize='md' fontFamily={theme.fonts.heading}>
                  Boost
                </Box>
              </Link>
              <Link to={`/dao/${dao.address}/settings`} as={RouterLink}>
                <Box fontSize='md' fontFamily={theme.fonts.heading}>
                  Settings
                </Box>
              </Link>
              <Link to={`/dao/${dao.address}/profile`} as={RouterLink}>
                <Box fontSize='md' fontFamily={theme.fonts.heading}>
                  Stats
                </Box>
              </Link>
            </Stack>
            <Flex mt={10} direction='column' w='60%'>
              <PrimaryButton onClick={setDefault} mb={3}>
                Default
              </PrimaryButton>
              <SecondaryButton onClick={setLocalTheme}>Other</SecondaryButton>
            </Flex>
          </>
        ) : (
          <>
            <Flex direction='row' justify='start' align='start'>
              <Flex direction='column' align='start' justify='start'>
                <Link
                  as={RouterLink}
                  to={`/`}
                  fontSize='xl'
                  fontFamily={theme.fonts.heading}
                  fontWeight={700}
                >
                  DAOhaus
                </Link>
                <ChangeDao />
              </Flex>
            </Flex>
            <Stack spacing={4} mt='125px' w='200px' pr={1}>
              <Box fontSize='xs'>Main Menu</Box>
              <Link href='https://daohaus.club' isExternal>
                <Box fontSize='xl' fontFamily={theme.fonts.heading}>
                  Explore DAOs
                </Box>
              </Link>
              <Link href='https://daohaus.club/summon' isExternal>
                <Box fontSize='xl' fontFamily={theme.fonts.heading}>
                  Summon a DAO
                </Box>
              </Link>
              <Link
                href='https://xdai.daohaus.club/dao/v2/0x283bdc900b6ec9397abb721c5bbff5ace46e0f50'
                isExternal
              >
                <Box fontSize='xl' fontFamily={theme.fonts.heading}>
                  HausDAO
                </Box>
              </Link>
              <Link href='https://daohaus.club/about' isExternal>
                <Box fontSize='md' fontFamily={theme.fonts.heading}>
                  About
                </Box>
              </Link>
              <Link href='https://daohaus.club/help' isExternal>
                <Box fontSize='md' fontFamily={theme.fonts.heading}>
                  Help
                </Box>
              </Link>
            </Stack>
            <Flex mt={10} direction='column' w='60%'>
              <PrimaryButton onClick={setDefault} mb={3}>
                Default
              </PrimaryButton>
              <SecondaryButton onClick={setLocalTheme}>Other</SecondaryButton>
            </Flex>
          </>
        )}
      </>

      <SecondaryButton
        colorScheme={theme.colors.secondary[500]}
        onClick={() => updateRefetchQuery('proposals')}
      >
        Refetch
      </SecondaryButton>
    </Box>
  );
};

export default SideNav;
