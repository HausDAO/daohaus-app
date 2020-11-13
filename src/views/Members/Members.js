import React, { useState } from 'react';
import { Flex, Box } from '@chakra-ui/core';

import MembersList from '../../components/Members/MembersList';
import MemberSnapshot from '../../components/Members/MemberSnapshot';
import MembersActivityFeed from '../../components/Members/MembersActivityFeed';

const Members = () => {
  const [selectedMember, setSelectedMember] = useState();

  return (
    <Flex p={6}>
      <Box w='70%'>
        <MembersList
          handleSelect={setSelectedMember}
          selectedMember={selectedMember}
        />
      </Box>
      <Box w='28%'>
        <MemberSnapshot selectedMember={selectedMember} />
        <MembersActivityFeed selectedMember={selectedMember} />
      </Box>
    </Flex>
  );
};

export default Members;
