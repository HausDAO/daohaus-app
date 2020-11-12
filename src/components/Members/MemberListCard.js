import React from 'react';
import { Link } from 'react-router-dom';
import { Flex, Skeleton, Box } from '@chakra-ui/core';
import { format } from 'date-fns';

import UserAvatar from '../Shared/UserAvatar';
import { useDao } from '../../contexts/PokemolContext';

const MemberListCard = ({ member, isLoaded }) => {
  const [dao] = useDao();

  return (
    <Flex
      as={Link}
      to={`/dao/${dao?.address}/profile/${member?.memberAddress}`}
      h='60px'
      align='center'
      pl={3}
      _hover={{ background: 'primary.500', borderRadius: '4px' }}
    >
      <Flex w='43%' direction='column' justify='space-between'>
        {member?.profile && <UserAvatar user={member.profile} />}
      </Flex>
      <Box w='15%'>
        <Skeleton isLoaded={isLoaded}>
          <Box fontFamily='mono'>{member?.shares ? member.shares : '--'}</Box>
        </Skeleton>
      </Box>
      <Box w='15%'>
        <Skeleton isLoaded={isLoaded}>
          <Box fontFamily='mono'>{member?.loot ? member.loot : '--'}</Box>
        </Skeleton>
      </Box>
      <Box>
        <Skeleton isLoaded={isLoaded}>
          <Box fontFamily='mono'>
            {member?.createdAt
              ? format(new Date(+member.createdAt * 1000), 'MMM. d, yyyy')
              : '--'}
          </Box>
        </Skeleton>
      </Box>
    </Flex>
  );
};

export default MemberListCard;
