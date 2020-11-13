import React, { useEffect, useState } from 'react';
import { Flex, Box, Skeleton } from '@chakra-ui/core';
import { format } from 'date-fns';
import { useMembers } from '../../contexts/PokemolContext';

import TextBox from '../Shared/TextBox';

import UserAvatar from '../Shared/UserAvatar';
import { memberProfile } from '../../utils/helpers';

const MemberInfoCardGuts = ({ user, context }) => {
  const [members] = useMembers();
  const [member, setMember] = useState(null);

  console.log(`Member info opened in ${context}`);

  useEffect(() => {
    setMember(memberProfile(members, user.username));
  }, [members, user.username]);

  return (
    <>
      <Flex justify='space-between'>
        <UserAvatar user={user.profile} />
      </Flex>
      <Flex w='100%' justify='space-between' mt={6}>
        <Box>
          <TextBox>Shares</TetBox>
          <Skeleton isLoaded={member?.shares}>
            <TextBox variant='value'>
              {member?.shares ? member.shares : '--'}
            </TextBox>
          </Skeleton>
        </Box>
        <Box>
          <TextBox>Loot</TextBox>
          <Skeleton isLoaded={member?.loot}>
            <Box fontSize='lg' fontFamily='space' fontWeight={700}>
              {member?.loot ? member.loot : '-'}
            </Box>
          </Skeleton>
        </Box>
        <Box>
          <Box
            textTransform='uppercase'
            fontSize='sm'
            fontFamily='heading'
            fontWeight={700}
            mb={2}
          >
            Anniversary
          </Box>
          <Skeleton isLoaded={member?.createdAt}>
            <Box fontSize='lg' fontFamily='space' fontWeight={700}>
              {member?.createdAt
                ? format(new Date(member.createdAt * 1000), 'MMMM d')
                : '--'}
            </Box>
          </Skeleton>
        </Box>
      </Flex>
    </>
  );
};

export default MemberInfoCardGuts;
