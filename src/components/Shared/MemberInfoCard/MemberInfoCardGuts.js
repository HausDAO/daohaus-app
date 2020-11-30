import React from 'react';
import { Flex, Box, Skeleton } from '@chakra-ui/core';
import TextBox from '../TextBox';
import { format } from 'date-fns';

import ProfileMenu from '../ProfileMenu';
import MemberAvatar from '../../Members/MemberAvatar';

const MemberInfoCardGuts = ({ user, member, showMenu }) => {
  return (
    <>
      <Flex justify='space-between'>
        <MemberAvatar member={member} />
        {showMenu && <ProfileMenu member={member} />}
      </Flex>
      <Flex w='75%' justify='space-between' mt={6}>
        <Box>
          <TextBox>Shares</TextBox>
          <Skeleton isLoaded={member?.shares}>
            <TextBox variant='value'>
              {member?.shares ? member.shares : '--'}
            </TextBox>
          </Skeleton>
        </Box>
        <Box>
          <TextBox>Loot</TextBox>
          <Skeleton isLoaded={member?.loot}>
            <TextBox variant='value'>
              {member?.loot ? member.loot : '-'}
            </TextBox>
          </Skeleton>
        </Box>
        <Box>
          <TextBox>Anniversary</TextBox>
          <Skeleton isLoaded={member?.createdAt}>
            <TextBox variant='value'>
              {member?.createdAt
                ? format(new Date(member.createdAt * 1000), 'MMMM d')
                : '--'}
            </TextBox>
          </Skeleton>
        </Box>
      </Flex>
    </>
  );
};

export default MemberInfoCardGuts;
