import React from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { Text, Stack, Spinner, Link, Box, Icon } from '@chakra-ui/core';

import { useDao, useLoading, useTheme } from '../../contexts/PokemolContext';

const SideNav = () => {
  const [loading] = useLoading();
  const [theme] = useTheme();
  const [dao] = useDao();
  const history = useHistory();

  return (
    <Box>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {dao ? (
            <>
              <Box>
                <Link as={RouterLink} to={`/dao/${dao.address}`}>
                  <Text
                    fontSize='2xl'
                    mt='45px'
                    fontFamily={theme.fonts.hub}
                    fontWeight={700}
                  >
                    {dao.apiMeta.name}
                  </Text>
                </Link>
                <Text fontSize='xs'>
                  Change Dao
                  <Icon name='chevron-down' />
                </Text>
              </Box>
              <Stack spacing={3} mt='125px' w='200px' pr={1}>
                <Text
                  fontSize='xs'
                  fontFamily={theme.fonts.heading}
                  cursor='pointer'
                  onClick={() => history.push('/')}
                >
                  Main Menu
                </Text>
                <Link to={`/dao/${dao.address}/proposals`} as={RouterLink}>
                  <Text fontSize='3xl' fontFamily={theme.fonts.heading}>
                    {theme.daoMeta.proposals}
                  </Text>
                </Link>
                <Link to={`/dao/${dao.address}/bank`} as={RouterLink}>
                  <Text fontSize='3xl' fontFamily={theme.fonts.heading}>
                    {theme.daoMeta.bank}
                  </Text>
                </Link>
                <Link to={`/dao/${dao.address}/members`} as={RouterLink}>
                  <Text fontSize='3xl' fontFamily={theme.fonts.heading}>
                    {theme.daoMeta.members}
                  </Text>
                </Link>
                <Link
                  to={`/dao/${dao.address}/settings/boosts`}
                  as={RouterLink}
                >
                  <Text fontSize='md' fontFamily={theme.fonts.heading}>
                    Boost
                  </Text>
                </Link>
                <Link to={`/dao/${dao.address}/settings`} as={RouterLink}>
                  <Text fontSize='md' fontFamily={theme.fonts.heading}>
                    Settings
                  </Text>
                </Link>
                <Link to={`/dao/${dao.address}/profile`} as={RouterLink}>
                  <Text fontSize='md' fontFamily={theme.fonts.heading}>
                    Stats
                  </Text>
                </Link>
              </Stack>
            </>
          ) : (
            <>
              <Text
                fontSize='4xl'
                mt='45px'
                fontFamily={theme.fonts.hub}
                fontWeight={700}
              >
                DAOhaus
              </Text>
              <Stack spacing={4} mt='125px' w='200px' pr={1}>
                <Text fontSize='xs'>Main Menu</Text>
                <Link href='https://daohaus.club' isExternal>
                  <Text fontSize='2xl'>Explore DAOs</Text>
                </Link>
                <Link href='https://daohaus.club/summon' isExternal>
                  <Text fontSize='2xl'>Summon a DAO</Text>
                </Link>
                <Link
                  href='https://xdai.daohaus.club/dao/v2/0x283bdc900b6ec9397abb721c5bbff5ace46e0f50'
                  isExternal
                >
                  <Text fontSize='2xl'>HausDAO</Text>
                </Link>
                <Link href='https://daohaus.club/about' isExternal>
                  <Text fontSize='md'>About</Text>
                </Link>
                <Link href='https://daohaus.club/help' isExternal>
                  <Text fontSize='md'>Help</Text>
                </Link>
              </Stack>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default SideNav;
