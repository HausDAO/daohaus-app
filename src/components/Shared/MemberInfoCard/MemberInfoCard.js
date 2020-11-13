import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Flex, Link } from '@chakra-ui/core';
import ContentBox from '../ContentBox';
import TextBox from '../TextBox';
import { useMembers, useDao } from '../../../contexts/PokemolContext';
import { useTheme } from '../../../contexts/CustomThemeContext';

import { memberProfile } from '../../../utils/helpers';
import MemberInfoCardGuts from './MemberInfoCardGuts';

const MemberInfoCard = ({ user }) => {
  const [dao] = useDao();
  const [members] = useMembers();
  const [, setMember] = useState(null);
  const [theme] = useTheme();
  const history = useHistory();

  useEffect(() => {
    setMember(memberProfile(members, user.username));
  }, [members, user.username]);

  return (
    <>
      <Flex justify='space-between'>
        <TextBox size='sm'>{theme.daoMeta.member} Info</TextBox>
        <TextBox
          as={Link}
          href={'/dao/' + dao.address + '/profile/' + user.username}
          color='inherit'
        >
          View my profile
        </TextBox>
      </Flex>
      <ContentBox mt={3}>
        <MemberInfoCardGuts user={user} />
      </ContentBox>
    </>
  );
};

export default MemberInfoCard;
