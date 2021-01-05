import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import makeBlockie from 'ethereum-blockies-base64';
import {
  Avatar,
  AvatarBadge,
  Input,
  Box,
  Flex,
  Link,
  Text,
} from '@chakra-ui/react';
import TextBox from '../Shared/TextBox';
import { themeImagePath } from '../../utils/helpers';

const MemberDaoList = ({ daos, label }) => {
  const [visibleDaos, setVisibleDaos] = useState([]);

  useEffect(() => {
    const firstDaos = [...daos];
    setVisibleDaos(firstDaos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daos]);

  const getDaoLink = (healthCount, dao) => {
    if (dao.apiMetadata) {
      return healthCount ? `/dao/${dao.id}/proposals` : `dao/${dao.id}`;
    } else {
      return `/register/${dao.id}`;
    }
  };

  const renderDaoAvatar = (dao) => {
    const recentProposals = dao.proposals.filter((prop) => {
      return prop.activityFeed.unread;
    });
    const healthCount = recentProposals.length;

    return (
      <Box key={dao.id + dao.networkId} mr={3} pb={3}>
        <Link
          as={RouterLink}
          to={getDaoLink(healthCount, dao)}
          display='flex'
          flexDirection='column'
          alignItems='center'
        >
          <Avatar
            name={
              dao.apiMetadata ? dao.apiMetadata.name.substr(0, 1) : 'no title'
            }
            src={
              dao.apiMetadata?.avatarImg
                ? themeImagePath(dao.apiMetadata.avatarImg)
                : makeBlockie(dao.id)
            }
            mb={3}
          >
            {healthCount ? (
              <AvatarBadge
                boxSize='1.25em'
                bg='red.500'
                borderColor='transparent'
                transition='all 0.15s linear'
                _hover={{ bg: 'secondary.500' }}
              >
                <Text fontSize='xs'>{healthCount}</Text>
              </AvatarBadge>
            ) : null}
          </Avatar>

          <Box
            fontFamily='mono'
            fontSize='sm'
            style={{
              width: '120px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textAlign: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            {dao.apiMetadata?.name}
          </Box>
        </Link>
      </Box>
    );
  };

  const handleChange = (event) => {
    if (event.target.value) {
      const resultDaos = daos.filter((dao) => {
        return (
          dao.apiMetadata.name
            .toLowerCase()
            .indexOf(event.target.value.toLowerCase()) > -1
        );
      });
      setVisibleDaos(resultDaos);
    } else {
      setVisibleDaos(daos);
    }
  };

  const canSearch = daos.length > 5;

  return (
    <>
      <Flex justify='space-between' alignItems='center' mb={6}>
        <TextBox size='xs'>
          {label} {daos.length} DAO{daos.length > 1 && 's'}
        </TextBox>
        {canSearch ? (
          <div>
            <Input
              type='search'
              className='input'
              placeholder='Search My Daos'
              onChange={(e) => handleChange(e)}
            />
          </div>
        ) : null}
      </Flex>

      <Flex direction='row' overflowX='scroll' mb={6} maxW='100%'>
        {visibleDaos.map((dao) => renderDaoAvatar(dao))}
      </Flex>
    </>
  );
};

export default MemberDaoList;
