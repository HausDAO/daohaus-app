import React from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { Stack, Link, Box, Flex, Button } from '@chakra-ui/core';

import { useDao, useRefetchQuery } from '../../contexts/PokemolContext';
import { useTheme } from '../../contexts/CustomThemeContext';
import ChangeDao from './ChangeDao';

const SideNav = () => {
  const [theme] = useTheme();
  const [dao] = useDao();
  const history = useHistory();
  const [, updateRefetchQuery] = useRefetchQuery();

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
                fontFamily='heading'
                cursor='pointer'
                onClick={() => history.push('/')}
              >
                Main Menu
              </Box>
              <Link to={`/dao/${dao.address}/proposals`} as={RouterLink}>
                <Box fontSize='2xl' fontFamily='heading'>
                  {theme.daoMeta.proposals}
                </Box>
              </Link>
              <Link to={`/dao/${dao.address}/bank`} as={RouterLink}>
                <Box fontSize='2xl' fontFamily='heading'>
                  {theme.daoMeta.bank}
                </Box>
              </Link>
              <Link to={`/dao/${dao.address}/members`} as={RouterLink}>
                <Box fontSize='2xl' fontFamily='heading'>
                  {theme.daoMeta.members}
                </Box>
              </Link>
              <Link to={`/dao/${dao.address}/settings/boosts`} as={RouterLink}>
                <Box fontSize='md' fontFamily='heading'>
                  Boost
                </Box>
              </Link>
              <Link to={`/dao/${dao.address}/settings`} as={RouterLink}>
                <Box fontSize='md' fontFamily='heading'>
                  Settings
                </Box>
              </Link>
              <Link to={`/dao/${dao.address}/profile`} as={RouterLink}>
                <Box fontSize='md' fontFamily='heading'>
                  Stats
                </Box>
              </Link>
            </Stack>
          </>
        ) : (
          <>
            <Flex direction='row' justify='start' align='start'>
              <Flex direction='column' align='start' justify='start'>
                <Link
                  as={RouterLink}
                  to={`/`}
                  fontSize='xl'
                  fontFamily='heading'
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
                <Box fontSize='xl' fontFamily='heading'>
                  Explore DAOs
                </Box>
              </Link>
              <Link href='https://daohaus.club/summon' isExternal>
                <Box fontSize='xl' fontFamily='heading'>
                  Summon a DAO
                </Box>
              </Link>
              <Link
                href='https://xdai.daohaus.club/dao/v2/0x283bdc900b6ec9397abb721c5bbff5ace46e0f50'
                isExternal
              >
                <Box fontSize='xl' fontFamily='heading'>
                  HausDAO
                </Box>
              </Link>
              <Link href='https://daohaus.club/about' isExternal>
                <Box fontSize='md' fontFamily='heading'>
                  About
                </Box>
              </Link>
              <Link href='https://daohaus.club/help' isExternal>
                <Box fontSize='md' fontFamily='heading'>
                  Help
                </Box>
              </Link>
            </Stack>
          </>
        )}
      </>
      <Flex direction='column' w='75px' pt='25px'>
        <Button
          variant='outline'
          onClick={() => updateRefetchQuery('proposals')}
          my={2}
        >
          Refetch
        </Button>
        <Button as={RouterLink} variant='outline' to='/themeSample' my={2}>
          Theme
        </Button>
      </Flex>
    </Box>
  );
};

export default SideNav;
