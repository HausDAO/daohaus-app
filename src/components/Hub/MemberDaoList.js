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

const MemberDaoList = ({ daos }) => {
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
      <Box key={dao.id} mr={3} pb={3}>
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
            {dao.title}
          </Box>
        </Link>
      </Box>
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
    <Box w='100%'>
      {daos?.length > 1 ? (
        <>
          <Flex justify='space-between' alignItems='center' mb={6}>
            <TextBox>
              Member of {daos.length} DAO{daos.length > 1 && 's'}
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

          <Link
            href='https://daohaus.club'
            isExternal
            fontSize='md'
            textTransform='uppercase'
          >
            Explore more DAOs on DAOhaus
          </Link>
        </>
      ) : (
        <>
          <Flex>
            <TextBox>You aren’t a member in any daos yet!</TextBox>
          </Flex>

          <Flex align='center'>
            <Box
              w='60px'
              h='60px'
              border='1px dashed rgba(255, 255, 255, 0.2);'
              borderRadius='40px'
              my={10}
            />
            <TextBox ml='15px'>Your daos will show here</TextBox>
          </Flex>

          <Link
            href='https://daohaus.club'
            isExternal
            fontSize='md'
            textTransform='uppercase'
          >
            Explore more DAOs on DAOhaus
          </Link>
        </>
      )}
    </Box>
  );
};

export default MemberDaoList;
