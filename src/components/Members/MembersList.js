import React, { useEffect, useState } from 'react';
import { Box, Flex } from '@chakra-ui/core';

import { useMembers } from '../../contexts/PokemolContext';
import { useTheme } from '../../contexts/CustomThemeContext';
import { defaultMembers } from '../../utils/constants';
import MemberListCard from './MemberListCard';

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
    <>
      <Flex>
        {filter ? (
          <Box
            ml={8}
            textTransform='uppercase'
            fontSize='sm'
            fontFamily='heading'
            cursor='pointer'
          >
            Filtered by:{' '}
            <span style={{ color: theme.colors.primary[50] }}>
              Action Needed
            </span>
          </Box>
        ) : (
          <Box
            ml={8}
            textTransform='uppercase'
            fontFamily='heading'
            cursor='pointer'
          >
            Apply a{' '}
            <span style={{ color: theme.colors.primary[50] }}> filter</span>
          </Box>
        )}
        <Box
          ml={8}
          textTransform='uppercase'
          fontSize='sm'
          fontFamily='heading'
          cursor='pointer'
        >
          Sort by:{' '}
          <span style={{ color: theme.colors.primary[50] }}>
            {' '}
            Voting Period
          </span>
        </Box>
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
            w='43%'
            textTransform='uppercase'
            fontFamily='heading'
            fontSize='sm'
            fontWeight={700}
            pl={3}
          >
            {theme.daoMeta.member}
          </Box>
          <Box
            w='15%'
            textTransform='uppercase'
            fontFamily='heading'
            fontSize='sm'
            fontWeight={700}
          >
            Shares
          </Box>
          <Box
            w='15%'
            textTransform='uppercase'
            fontFamily='heading'
            fontSize='sm'
            fontWeight={700}
          >
            Loot
          </Box>
          <Box
            textTransform='uppercase'
            fontFamily='heading'
            fontSize='sm'
            fontWeight={700}
          >
            Join Date
          </Box>
        </Flex>
        {_members?.length > 0 &&
          _members.map((member) => {
            return (
              <MemberListCard
                key={member?.id}
                member={member}
                isLoaded={isLoaded}
              />
            );
          })}
      </Box>
    </>
  );
};

export default MembersList;
