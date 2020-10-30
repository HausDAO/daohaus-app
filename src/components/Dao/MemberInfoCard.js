import React, { useEffect, useState } from 'react';
import { Flex, Text, Box } from '@chakra-ui/core';
import { format } from 'date-fns';
import { useTheme, useMembers } from '../../contexts/PokemolContext';
import UserAvatar from '../Shared/UserAvatar';
import { memberProfile } from '../../utils/helpers';

const MemberInfoCard = ({ user }) => {
  const [members] = useMembers();
  const [member, setMember] = useState(null);
  const [theme] = useTheme();

  useEffect(() => {
    setMember(memberProfile(members, user.username));
  }, [members, user.username]);

  return (
    <>
      <Flex justify='space-between' ml={6}>
        <Text
          textTransform='uppercase'
          fontSize='sm'
          fontFamily={theme.fonts.heading}
        >
          {theme.daoMeta.member} Info
        </Text>
        <Text
          textTransform='uppercase'
          fontSize='sm'
          fontFamily={theme.fonts.heading}
        >
          View my profile
        </Text>
      </Flex>
      <Box
        rounded='lg'
        bg='blackAlpha.600'
        borderWidth='1px'
        borderColor='whiteAlpha.200'
        p={6}
        m={6}
        mt={2}
        w='97%'
      >
        <Flex justify='space-between'>
          <UserAvatar user={user.profile} />
        </Flex>
        <Flex w='75%' justify='space-between' mt={6}>
          <Box>
            <Text
              textTransform='uppercase'
              fontSize='sm'
              fontFamily={theme.fonts.heading}
              fontWeight={700}
              mb={2}
            >
              Shares
            </Text>
            <Text fontSize='lg' fontFamily={theme.fonts.space} fontWeight={700}>
              {member?.shares ? member.shares : '-'}
            </Text>
          </Box>
          <Box>
            <Text
              textTransform='uppercase'
              fontSize='sm'
              fontFamily={theme.fonts.heading}
              fontWeight={700}
              mb={2}
            >
              Loot
            </Text>
            <Text fontSize='lg' fontFamily={theme.fonts.space} fontWeight={700}>
              {member?.loot ? member.loot : '-'}
            </Text>
          </Box>
          <Box>
            <Text
              textTransform='uppercase'
              fontSize='sm'
              fontFamily={theme.fonts.heading}
              fontWeight={700}
              mb={2}
            >
              Anniversary
            </Text>
            <Text fontSize='lg' fontFamily={theme.fonts.space} fontWeight={700}>
              {member?.createdAt
                ? format(new Date(member.createdAt * 1000), 'MMMM dd')
                : '-'}
            </Text>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default MemberInfoCard;
