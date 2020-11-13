import React, { useEffect, useState } from 'react';
import { Flex, Box } from '@chakra-ui/core';
import { useMembers } from '../../contexts/PokemolContext';
import { useTheme } from '../../contexts/CustomThemeContext';

import { memberProfile } from '../../utils/helpers';
import MemberInfoCardGuts from './MemberInfoCardGuts';
import TextBox from '../Shared/TextBox';
import ContentBox from '../Shared/ContentBox';

const MemberInfoCard = ({ user }) => {
  const [members] = useMembers();
  const [, setMember] = useState(null);
  const [theme] = useTheme();

  useEffect(() => {
    setMember(memberProfile(members, user.username));
  }, [members, user.username]);

  return (
    <Box ml={6}>
      <Flex justify='space-between'>
        <TextBox size='sm' color='white'>
          {theme.daoMeta.member} Info
        </TextBox>
        <TextBox size='sm' color='white'>
          View my profile
        </TextBox>
      </Flex>
      <ContentBox mt={2} w='97%'>
        <MemberInfoCardGuts user={user} />
      </ContentBox>
    </Box>
  );
};

export default MemberInfoCard;
