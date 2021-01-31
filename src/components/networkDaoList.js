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
} from '@chakra-ui/react';
import { themeImagePath } from '../utils/metadata';
import makeBlockie from 'ethereum-blockies-base64';

const NetworkDaoList = ({ data, network, searchTerm, index }) => {
  const [sortedDaoList, setSortedDaoList] = useState([]);

  useEffect(() => {
    setSortedDaoList(
      data
        ?.filter((dao) => {
          return searchTerm
            ? dao.meta.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
            : true;
        })
        .sort((a, b) => {
          return !a.meta ? -100 : +b.meta.version - +a.meta.version;
        }),
    );
  }, [searchTerm]);

  const getDaoLink = (unReadCount, dao) => {
    if (!dao.meta) {
      return `/register/${dao.network.networkID}/${dao.molochAddress}/`;
    }

    // TODO: how to deal with v1 link
    // if (dao.meta.version === '1') {
    //   // return pokemolUrl(dao);
    // } else {
    return unReadCount
      ? `/dao/${network.networkID}/${dao.molochAddress}/proposals`
      : `dao/${network.networkID}/${dao.molochAddress}`;
    // }
  };

  const renderDaoAvatar = (dao) => {
    const unReadCount = dao.moloch.proposals.filter((prop) => {
      return prop.activityFeed.unread;
    }).length;

    return (
      <Box key={dao.molochAddress + dao.networkID} mr={3} pb={3}>
        <Link
          as={RouterLink}
          to={getDaoLink(unReadCount, dao)}
          display='flex'
          flexDirection='column'
          alignItems='center'
        >
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
              fontSize='sm'
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
              REGISTER ME
            </Box>
          )}
        </Link>
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
              {network?.name} ({sortedDaoList.length})
            </Text>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <Flex direction='row' overflowX='scroll' mb={6} maxW='100%'>
              {sortedDaoList.map((dao) => renderDaoAvatar(dao))}
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default NetworkDaoList;
