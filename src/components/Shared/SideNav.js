import React from 'react';
import { Link } from 'react-router-dom';
import { Text, Flex, Stack, Spinner, Link as ChLink } from '@chakra-ui/core';

import { useDao, useLoading } from '../../contexts/PokemolContext';

const SideNav = () => {
  const [loading] = useLoading();
  const [dao] = useDao();

  return (
    <Flex direction='column'>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {dao ? (
            <>
              <Link to={`/dao/${dao.address}`}>
                <Text fontSize='l' mt='30px'>
                  {dao.apiMeta.name}
                </Text>
              </Link>
              <Text fontSize='xs'>Change Dao</Text>
              <Stack spacing={5} mt='200px' pr='20'>
                <Text fontSize='xs'>Main Menu</Text>
                <Link to={`/dao/${dao.address}/proposals`}>
                  <Text fontSize='3xl'>Quests</Text>
                </Link>
                <Link to={`/dao/${dao.address}/bank`}>
                  <Text fontSize='3xl'>Inventory</Text>
                </Link>
                <Link to={`/dao/${dao.address}/members`}>
                  <Text fontSize='3xl'>Players</Text>
                </Link>
                <Link to={`/dao/${dao.address}/settings/boosts`}>
                  <Text fontSize='m'>Boost</Text>
                </Link>
                <Link to={`/dao/${dao.address}/settings`}>
                  <Text fontSize='m'>Settings</Text>
                </Link>
                <Link to={`/dao/${dao.address}/profile`}>
                  <Text fontSize='m'>Stats</Text>
                </Link>
              </Stack>
            </>
          ) : (
            <>
              <Text fontSize='l' mt='30px'>
                DAOhaus
              </Text>
              <Stack spacing={5} mt='200px' pr='20'>
                <Text fontSize='xs'>Main Menu</Text>
                <ChLink href='https://daohaus.club' isExternal>
                  <Text fontSize='3xl'>Explore DAOs</Text>
                </ChLink>
                <ChLink href='https://daohaus.club/summon' isExternal>
                  <Text fontSize='3xl'>Summon a DAO</Text>
                </ChLink>
                <ChLink
                  href='https://xdai.daohaus.club/dao/v2/0x283bdc900b6ec9397abb721c5bbff5ace46e0f50'
                  isExternal
                >
                  <Text fontSize='3xl'>HausDAO</Text>
                </ChLink>
                <ChLink href='https://daohaus.club/about' isExternal>
                  <Text fontSize='m'>About</Text>
                </ChLink>
                <ChLink href='https://daohaus.club/help' isExternal>
                  <Text fontSize='m'>Help</Text>
                </ChLink>
              </Stack>
            </>
          )}
        </>
      )}
    </Flex>
  );
};

export default SideNav;
