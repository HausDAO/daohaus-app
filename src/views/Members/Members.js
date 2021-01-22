import React, { useState, useEffect } from 'react';
import { Flex, Box } from '@chakra-ui/react';

import MembersList from '../../components/Members/MembersList';
import MemberSnapshot from '../../components/Members/MemberSnapshot';
import MembersActivityFeed from '../../components/Members/MembersActivityFeed';
import MemberInfoCard from '../../components/Shared/MemberInfoCard/MemberInfoCard';

const Members = () => {
  const [selectedMember, setSelectedMember] = useState();
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 100) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
  });

  const scrolledStyle = {
    position: 'sticky',
    top: 20,
  };

  return (
    <Flex p={6} wrap='wrap'>
      <Box
        w={['100%', null, null, null, '60%']}
        pr={[0, null, null, null, 6]}
        pb={6}
      >
        <MembersList
          handleSelect={setSelectedMember}
          selectedMember={selectedMember}
        />
      </Box>
      <Box w={['100%', null, null, null, '40%']}>
        <Box style={scrolled ? scrolledStyle : null}>
          {selectedMember ? (
            <MemberInfoCard user={selectedMember} showMenu={true} />
          ) : (
            <MemberSnapshot selectedMember={selectedMember} />
          )}

          <MembersActivityFeed selectedMember={selectedMember} />
        </Box>
      </Box>
    </Flex>
  );
};

export default Members;
