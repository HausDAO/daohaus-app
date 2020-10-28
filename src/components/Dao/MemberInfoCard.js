import React from 'react';
import { Flex, Text, Box } from '@chakra-ui/core';
import UserAvatar from '../Shared/UserAvatar';

const MemberInfoCard = ({ user }) => {
  return (
    <>
      <Flex justify='space-between' ml={6}>
        <Text textTransform='uppercase' fontSize='0.9em'>
          Member Info
        </Text>
        <Text textTransform='uppercase' fontSize='0.9em'>
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
        <Flex w='60%' justify='space-between' mt={6}>
          <Box>
            <Text textTransform='uppercase'>Shares</Text>
            <Text>10</Text>
          </Box>
          <Box>
            <Text textTransform='uppercase'>Loot</Text>
            <Text>5</Text>
          </Box>
          <Box>
            <Text textTransform='uppercase'>Anniversary</Text>
            <Text>Jan 1</Text>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default MemberInfoCard;
