import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import makeBlockie from 'ethereum-blockies-base64';
import { Avatar, AvatarBadge, Box, Flex, Link } from '@chakra-ui/core';

import { useTheme } from '../../contexts/CustomThemeContext';

const MemberDaoList = ({ daos }) => {
  const [theme] = useTheme();
  const [visibleDaos, setVisibleDaos] = useState([]);

  useEffect(() => {
    const firstDaos = [...daos];

    setVisibleDaos(firstDaos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderDaoAvatar = (dao) => {
    const recentRages = dao.rageQuits.filter((rage) => {
      // 1209600 === 2 weeks in seconds
      const now = (new Date() / 1000) | 0;
      return +rage.createdAt >= now - 1209600;
    });
    const recentProposals = dao.proposals.filter((prop) => {
      return prop.activityFeed.unread;
    });
    const healthCount = recentRages.length + recentProposals.length;

    return (
      <div key={dao.id}>
        <Link
          as={RouterLink}
          to={`/dao/${dao.id}`}
          display='flex'
          flexDirection='column'
          alignItems='center'
        >
          <Avatar
            name={dao.title.substr(0, 1)}
            src={makeBlockie(dao.id)}
            mb={4}
          >
            {healthCount ? (
              <AvatarBadge w='1.25em' h='1.25em' bg='red.500'>
                {healthCount}
              </AvatarBadge>
            ) : null}
          </Avatar>

          <Box fontFamily={theme.fonts.mono} fontSize='sm'>
            {dao.title}
          </Box>
        </Link>
      </div>
    );
  };

  const handleChange = (event) => {
    if (event.target.value) {
      const resultDaos = daos.filter((dao) => {
        return (
          dao.title.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1
        );
      });
      setVisibleDaos(resultDaos);
    } else {
      setVisibleDaos(daos);
    }
  };

  const canSearch = daos.length > 5;

  return (
    <Box maxW='500px'>
      <Box
        fontFamily={theme.fonts.heading}
        fontSize='lg'
        fontWeight={700}
        mb={6}
      >
        Member of {daos.length} DAO{daos.length > 1 && 's'}
      </Box>

      <Flex direction='row' overflowX='scroll' mb={6} w='100%'>
        {visibleDaos.map((dao) => renderDaoAvatar(dao))}
      </Flex>

      {canSearch ? (
        <div>
          <input
            type='search'
            className='input'
            placeholder='Search My Daos'
            onChange={(e) => handleChange(e)}
          />
        </div>
      ) : null}

      <Link
        href='https://daohaus.club'
        isExternal
        fontSize='md'
        textTransform='uppercase'
      >
        Explore more daos on daohaus
      </Link>
    </Box>
  );
};

export default MemberDaoList;
