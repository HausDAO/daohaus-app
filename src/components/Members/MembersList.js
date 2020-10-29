import React, { useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/core';

import { useTheme } from '../../contexts/PokemolContext';

const members = [
  {
    name: 'Vitalik1',
    shares: '1337',
    loot: '100',
    join: 'July 30, 2020',
  },
  {
    name: 'Vitalik2',
    shares: '1337',
    loot: '100',
    join: 'July 30, 2020',
  },
  {
    name: 'Vitalik3',
    shares: '1337',
    loot: '100',
    join: 'July 30, 2020',
  },
];

const MembersList = () => {
  const [theme] = useTheme();
  const filter = useState(null);

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
        {members.map((member) => {
          return (
            <Flex h='60px' key={member.name} align='center'>
              <Flex w='10%' ml='5%'>
                <Text>hello</Text>
              </Flex>
              <Flex w='30%' direction='column' justify='space-between'>
                <Text fontSize='md' fontFamily={theme.fonts.heading}>
                  {member.name}
                </Text>
                <Text
                  fontSize='xs'
                  fontFamily={theme.fonts.mono}
                  fontWeight={300}
                >
                  {member.name}
                </Text>
              </Flex>
              <Box w='15%' fontFamily={theme.fonts.heading}>
                {member.shares}
              </Box>
              <Box w='15%' fontFamily={theme.fonts.heading}>
                {member.loot}
              </Box>
              <Box fontFamily={theme.fonts.heading}>{member.join}</Box>
            </Flex>
          );
        })}
      </Box>
    </Box>
  );
};

export default MembersList;
