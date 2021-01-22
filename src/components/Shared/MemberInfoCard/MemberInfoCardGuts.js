import React from 'react';
import { Flex, Box, Skeleton } from '@chakra-ui/react';
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
      <Flex w='100%' justify='space-between' mt={6}>
        <Box>
          <TextBox size='xs'>Shares</TextBox>
          <Skeleton isLoaded={member?.shares}>
            <TextBox variant='value' size='xl'>
              {member?.shares ? member.shares : '--'}
            </TextBox>
          </Skeleton>
        </Box>
        <Box>
          <TextBox size='xs'>Loot</TextBox>
          <Skeleton isLoaded={member?.loot}>
            <TextBox variant='value' size='xl'>
              {member?.loot ? member.loot : '-'}
            </TextBox>
          </Skeleton>
        </Box>
        <Box>
          <TextBox size='xs'>Anniversary</TextBox>
          <Skeleton isLoaded={member?.createdAt}>
            <TextBox variant='value' size='xl'>
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
