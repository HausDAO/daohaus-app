import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  AvatarBadge,
  Box,
  Flex,
  Link,
  Text,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Icon,
} from '@chakra-ui/react';
import makeBlockie from 'ethereum-blockies-base64';
import { FiAlertOctagon } from 'react-icons/fi';
import { pokemolUrlHubList, themeImagePath } from '../utils/metadata';

const LinkForVersion = ({ children, dao, unReadCount, network }) => {
  const getDaoLink = (unReadCount, dao) => {
    if (!dao.meta) {
      return `/register/${network.networkID}/${dao.molochAddress}`;
    }
    if (dao.meta.version === '1') {
      return pokemolUrlHubList(dao);
    }
    return unReadCount
      ? `/dao/${network.networkID}/${dao.molochAddress}/proposals`
      : `dao/${network.networkID}/${dao.molochAddress}`;
  };

  if (dao.meta && dao.meta.version === '1') {
    return (
      <Link
        href={getDaoLink(unReadCount, dao)}
        target='_blank'
        rel='noreferrer noopener'
        display='flex'
        flexDirection='column'
        alignItems='center'
      >
        {children}
      </Link>
    );
  }
  return (
    <Link
      as={RouterLink}
      to={getDaoLink(unReadCount, dao)}
      display='flex'
      flexDirection='column'
      alignItems='center'
    >
      {children}
    </Link>
  );
};

const NetworkDaoList = ({ data, network, searchTerm, index }) => {
  const [sortedDaoList, setSortedDaoList] = useState([]);

  useEffect(() => {
    setSortedDaoList(
      data
        ?.filter(dao => {
          return searchTerm
            ? dao.meta?.name.toLowerCase().indexOf(searchTerm.toLowerCase()) >
                -1
            : true;
        })
        .sort((a, b) => {
          return !a.meta ? -100 : +b.meta?.version - +a.meta?.version;
        }),
    );
  }, [searchTerm]);

  const renderDaoAvatar = dao => {
    const unReadCount = dao.moloch.proposals.filter(prop => {
      return prop.activityFeed.unread;
    }).length;

    return (
      <Box key={dao.molochAddress + dao.networkID} mr={3} pb={3}>
        <LinkForVersion dao={dao} unReadCount={unReadCount} network={network}>
          {!dao.meta ? (
            <Icon as={FiAlertOctagon} color='yellow.300' h={50} w={50} mb={3} />
          ) : (
            <Avatar
              name={dao.meta ? dao.meta.name.substr(0, 1) : 'no title'}
              src={
                dao.meta?.avatarImg
                  ? themeImagePath(dao.meta.avatarImg)
                  : makeBlockie(dao.molochAddress)
              }
              mb={3}
              bg='black'
            >
              {unReadCount ? (
                <AvatarBadge
                  boxSize='1.25em'
                  bg='red.500'
                  borderColor='transparent'
                  transition='all 0.15s linear'
                  _hover={{ bg: 'secondary.500' }}
                >
                  <Text fontSize='xs'>{unReadCount}</Text>
                </AvatarBadge>
              ) : null}
            </Avatar>
          )}

          {dao.meta ? (
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
              {dao.meta.name}
            </Box>
          ) : (
            <Box
              fontFamily='mono'
              fontSize='xs'
              color='red.500'
              fontWeight='900'
              style={{
                width: '120px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textAlign: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              REGISTER NEW DAO
            </Box>
          )}
        </LinkForVersion>
      </Box>
    );
  };

  const defaultOpen =
    !index || network.networkID === '0x1' || network.networkID === '0x64'
      ? 0
      : null;

  return (
    <>
      <Accordion allowToggle defaultIndex={defaultOpen}>
        <AccordionItem border={0} isDisabled={sortedDaoList.length < 1}>
          <AccordionButton>
            <Text fontFamily='mono' fontSize='sm' flex='1' textAlign='left'>
              {`${network?.name} (${sortedDaoList.length})`}
            </Text>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <Flex
              direction='row'
              overflowX='scroll'
              mb={6}
              maxW='100%'
              css={{
                /* Hide scrollbar for IE and Edge */
                '&::MsOverflowStyle': 'none',
                /* Hide scrollbar for Chrome/Opera */
                '&::WebkitScrollbar': {
                  display: 'none',
                },
                /* Hide scrollbar for Firefox */
                '&::ScrollbarWidth': 'none',
              }}
            >
              {sortedDaoList.map(dao => renderDaoAvatar(dao))}
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default NetworkDaoList;
