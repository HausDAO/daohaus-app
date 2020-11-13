import React from 'react';
import { Flex, Skeleton, Box } from '@chakra-ui/core';
import { format } from 'date-fns';

import UserAvatar from '../Shared/UserAvatar';

const MemberListCard = ({ member, isLoaded, handleSelect, selectedMember }) => {
  return (
    <Flex
      h='60px'
      align='center'
      pl={3}
      bg={
        selectedMember && selectedMember.memberAddress === member.memberAddress
          ? 'primary.500'
          : null
      }
      _hover={{
        cursor: 'pointer',
        background: 'primary.500',
        borderRadius: '4px',
      }}
      onClick={() => handleSelect(member)}
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
