import React, { useEffect, useState } from 'react';
import { Box, Flex, Skeleton, Text } from '@chakra-ui/core';
import { format } from 'date-fns';

import { useMembers, useTheme } from '../../contexts/PokemolContext';
// import UserAvatar from '../Shared/UserAvatar';
import { truncateAddr } from '../../utils/helpers';
import { defaultMembers } from '../../utils/constants';

const MembersList = () => {
  const [theme] = useTheme();
  const filter = useState(null);
  const [members] = useMembers();
  const [_members, setMembers] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (members?.length > 0) {
      setMembers(members);
      setIsLoaded(true);
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
            <span style={{ color: theme.colors.primary[50] }}>
              Action Needed
            </span>
          </Text>
        ) : (
          <Text
            ml={8}
            textTransform='uppercase'
            fontFamily={theme.fonts.heading}
            cursor='pointer'
          >
            Apply a{' '}
            <span style={{ color: theme.colors.primary[50] }}> filter</span>
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
          <span style={{ color: theme.colors.primary[50] }}>
            {' '}
            Voting Period
          </span>
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
                  <Skeleton isLoaded={isLoaded}>
                    <Text fontSize='md' fontFamily={theme.fonts.heading}>
                      {member?.profile?.name ? member.profile.name : '--'}
                    </Text>
                    <Text
                      fontSize='xs'
                      fontFamily={theme.fonts.mono}
                      fontWeight={300}
                    >
                      {truncateAddr(member.memberAddress)}
                    </Text>
                  </Skeleton>
                </Flex>
                <Box w='15%'>
                  <Skeleton isLoaded={isLoaded}>
                    <Text fontFamily={theme.fonts.heading}>
                      {member?.shares ? member.shares : '--'}
                    </Text>
                  </Skeleton>
                </Box>
                <Box w='15%'>
                  <Skeleton isLoaded={isLoaded}>
                    <Text fontFamily={theme.fonts.heading}>
                      {member?.loot ? member.loot : '--'}
                    </Text>
                  </Skeleton>
                </Box>
                <Box>
                  <Skeleton isLoaded={isLoaded}>
                    <Text fontFamily={theme.fonts.heading}>
                      {member?.createdAt
                        ? format(
                            new Date(+member.createdAt * 1000),
                            'MMM. d, yyyy',
                          )
                        : '--'}
                    </Text>
                  </Skeleton>
                </Box>
              </Flex>
            );
          })}
      </Box>
    </Box>
  );
};

export default MembersList;
