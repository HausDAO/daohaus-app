import React, { useEffect, useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/core';
import { format } from 'date-fns';

import { useMembers, useTheme } from '../../contexts/PokemolContext';
// import UserAvatar from '../Shared/UserAvatar';
import { truncateAddr } from '../../utils/helpers';

const defaultMembers = [
  {
    id: 1,
    memberAddress: '0x501f352e32ec0c981268dc5b5ba1d3661b1acbc6',
    profile: {
      name: 'Vitalik',
    },
    username: '0x501f352e32ec0c981268dc5b5ba1d3661b1acbc6',
  },
  {
    id: 2,
    memberAddress: '0x501f352e32ec0c981268dc5b5ba1d3661b1acbc6',
    profile: {
      name: 'Hal Finney',
    },
    username: '0x501f352e32ec0c981268dc5b5ba1d3661b1acbc6',
  },
  {
    id: 3,
    memberAddress: '0x501f352e32ec0c981268dc5b5ba1d3661b1acbc6',
    profile: {
      name: 'Satoshi',
    },
    username: '0x501f352e32ec0c981268dc5b5ba1d3661b1acbc6',
  },
];

const MembersList = () => {
  const [theme] = useTheme();
  const filter = useState(null);
  const [members] = useMembers();
  const [_members, setMembers] = useState(null);
  // console.log(members);

  useEffect(() => {
    if (members?.length > 0) {
      setMembers(members);
    } else {
      setMembers(defaultMembers);
    }
  }, [members]);

  return (
    <Box w='60%'>
      <Flex>
        {filter ? (
          <Text
            ml={8}
            textTransform='uppercase'
            fontSize='sm'
            fontFamily={theme.fonts.heading}
            cursor='pointer'
          >
            Filtered by:{' '}
            <span style={{ color: theme.colors.brand[50] }}>Action Needed</span>
          </Text>
        ) : (
          <Text
            ml={8}
            textTransform='uppercase'
            fontFamily={theme.fonts.heading}
            cursor='pointer'
          >
            Apply a{' '}
            <span style={{ color: theme.colors.brand[50] }}> filter</span>
          </Text>
        )}
        <Text
          ml={8}
          textTransform='uppercase'
          fontSize='sm'
          fontFamily={theme.fonts.heading}
          cursor='pointer'
        >
          Sort by:{' '}
          <span style={{ color: theme.colors.brand[50] }}> Voting Period</span>
        </Text>
      </Flex>
      <Box
        rounded='lg'
        bg='blackAlpha.600'
        borderWidth='1px'
        borderColor='whiteAlpha.200'
        p={6}
        m={6}
      >
        <Flex mb={5}>
          <Box
            w='45%'
            textTransform='uppercase'
            fontFamily={theme.fonts.heading}
            fontSize='sm'
            fontWeight={700}
          >
            {theme.daoMeta.member}
          </Box>
          <Box
            w='15%'
            textTransform='uppercase'
            fontFamily={theme.fonts.heading}
            fontSize='sm'
            fontWeight={700}
          >
            Shares
          </Box>
          <Box
            w='15%'
            textTransform='uppercase'
            fontFamily={theme.fonts.heading}
            fontSize='sm'
            fontWeight={700}
          >
            Loot
          </Box>
          <Box
            textTransform='uppercase'
            fontFamily={theme.fonts.heading}
            fontSize='sm'
            fontWeight={700}
          >
            Join Date
          </Box>
        </Flex>
        {_members?.length > 0 &&
          _members.map((member) => {
            return (
              <Flex h='60px' key={member.id} align='center'>
                <Flex w='8%' ml='2%'></Flex>
                <Flex w='35%' direction='column' justify='space-between'>
                  <Text fontSize='md' fontFamily={theme.fonts.heading}>
                    {member?.profile?.name ? member.profile.name : '-'}
                  </Text>
                  <Text
                    fontSize='xs'
                    fontFamily={theme.fonts.mono}
                    fontWeight={300}
                  >
                    {truncateAddr(member.memberAddress)}
                  </Text>
                </Flex>
                <Box w='15%' fontFamily={theme.fonts.heading}>
                  {member?.shares ? member.shares : '-'}
                </Box>
                <Box w='15%' fontFamily={theme.fonts.heading}>
                  {member?.loot ? member.loot : '-'}
                </Box>
                <Box fontFamily={theme.fonts.heading}>
                  {member?.createdAt
                    ? format(new Date(+member.createdAt * 1000), 'MMM. d, yyyy')
                    : '-'}
                </Box>
              </Flex>
            );
          })}
      </Box>
    </Box>
  );
};

export default MembersList;
