import React from 'react';
import { Flex, Box } from '@chakra-ui/core';

import MembersList from '../../components/Members/MembersList';
import MemberSnapshot from '../../components/Members/MemberSnapshot';
import MembersActivityFeed from '../../components/Members/MembersActivityFeed';

const Members = () => {
  return (
    <Flex>
      <Box w='70%'>
        <MembersList />
      </Box>
      <Box w='28%'>
        <MemberSnapshot />
        <MembersActivityFeed />
      </Box>
    </Flex>
  );
};

export default Members;
