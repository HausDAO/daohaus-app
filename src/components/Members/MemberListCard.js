import React from 'react';
import { Flex, Skeleton, Box } from '@chakra-ui/core';
import { format } from 'date-fns';

import UserAvatar from '../Shared/UserAvatar';

const MemberListCard = ({ member, isLoaded }) => {
  return (
    <Flex h='60px' align='center'>
      <Flex w='43%' direction='column' justify='space-between'>
        {member?.profile && <UserAvatar user={member.profile} />}
      </Flex>
      <Box w='15%'>
        <Skeleton isLoaded={isLoaded}>
          <Box fontFamily='heading'>
            {member?.shares ? member.shares : '--'}
          </Box>
        </Skeleton>
      </Box>
      <Box w='15%'>
        <Skeleton isLoaded={isLoaded}>
          <Box fontFamily='heading'>{member?.loot ? member.loot : '--'}</Box>
        </Skeleton>
      </Box>
      <Box>
        <Skeleton isLoaded={isLoaded}>
          <Box fontFamily='heading'>
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
