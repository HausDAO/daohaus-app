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
        <Flex>
          <UserAvatar user={user} />
        </Flex>
      </Box>
    </>
  );
};

export default MemberInfoCard;
