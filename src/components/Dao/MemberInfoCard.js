import React, { useEffect, useState } from 'react';
import { Flex, Box } from '@chakra-ui/core';
import { useMembers } from '../../contexts/PokemolContext';
import { useTheme } from '../../contexts/CustomThemeContext';

import { memberProfile } from '../../utils/helpers';
import MemberInfoCardGuts from './MemberInfoCardGuts';

const MemberInfoCard = ({ user }) => {
  const [members] = useMembers();
  const [, setMember] = useState(null);
  const [theme] = useTheme();

  useEffect(() => {
    setMember(memberProfile(members, user.username));
  }, [members, user.username]);

  return (
    <>
      <Flex justify='space-between' ml={6}>
        <Box textTransform='uppercase' fontSize='sm' fontFamily='heading'>
          {theme.daoMeta.member} Info
        </Box>
        <Box textTransform='uppercase' fontSize='sm' fontFamily='heading'>
          View my profile
        </Box>
      </Flex>
      <MemberInfoCardGuts user={user} />
    </>
  );
};

export default MemberInfoCard;
