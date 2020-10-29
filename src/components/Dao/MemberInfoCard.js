import React from 'react';
import { Flex, Text, Box } from '@chakra-ui/core';
import { useTheme } from '../../contexts/PokemolContext';
import UserAvatar from '../Shared/UserAvatar';

const MemberInfoCard = ({ user }) => {
  const [theme] = useTheme();

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
          <UserAvatar user={user} />
          <div></div>
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
              10
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
              5
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
              Jan 1
            </Text>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default MemberInfoCard;
