import React from 'react';
import { Flex, Skeleton, Box } from '@chakra-ui/core';
import { format } from 'date-fns';

import { useTheme } from '../../contexts/CustomThemeContext';
import UserAvatar from '../Shared/UserAvatar';

const MemberListCard = ({ member, isLoaded }) => {
  console.log(member);

  const [theme] = useTheme();
  return (
    <Flex h='60px' align='center'>
      <Flex w='43%' direction='column' justify='space-between'>
        {/* <Skeleton isLoaded={isLoaded}>
          <Box fontSize='md' fontFamily={theme.fonts.heading}>
            {member?.profile?.name ? member.profile.name : '--'}
          </Box>
          <Box fontSize='xs' fontFamily={theme.fonts.mono} fontWeight={300}>
            {truncateAddr(member.memberAddress)}
          </Box>
        </Skeleton> */}
        {member?.profile && <UserAvatar user={member.profile} />}
      </Flex>
      <Box w='15%'>
        <Skeleton isLoaded={isLoaded}>
          <Box fontFamily={theme.fonts.heading}>
            {member?.shares ? member.shares : '--'}
          </Box>
        </Skeleton>
      </Box>
      <Box w='15%'>
        <Skeleton isLoaded={isLoaded}>
          <Box fontFamily={theme.fonts.heading}>
            {member?.loot ? member.loot : '--'}
          </Box>
        </Skeleton>
      </Box>
      <Box>
        <Skeleton isLoaded={isLoaded}>
          <Box fontFamily={theme.fonts.heading}>
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
