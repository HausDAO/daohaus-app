import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flex } from '@chakra-ui/core';
import ContentBox from '../ContentBox';
import TextBox from '../TextBox';
import {
  useMembers,
  useDao,
  useMemberWallet,
} from '../../../contexts/PokemolContext';
import { useTheme } from '../../../contexts/CustomThemeContext';

import { memberProfile } from '../../../utils/helpers';
import MemberInfoCardGuts from './MemberInfoCardGuts';

const MemberInfoCard = ({ user, showMenu }) => {
  const [memberWallet] = useMemberWallet();
  const [dao] = useDao();
  const [members] = useMembers();
  const [member, setMember] = useState(null);
  const [theme] = useTheme();

  useEffect(() => {
    if (user?.memberAddress) {
      setMember(user);
    } else {
      setMember(memberProfile(members, user.username));
    }
  }, [members, user]);

  return (
    <>
      <Flex justify='space-between'>
        <TextBox size='sm'>{theme.daoMeta.member} Info</TextBox>
        {member && (
          <TextBox
            as={Link}
            to={'/dao/' + dao.address + '/profile/' + member.memberAddress}
            color='inherit'
          >
            View{' '}
            {memberWallet?.memberAddress?.toLowerCase() ===
              member?.memberAddress && 'my'}{' '}
            profile
          </TextBox>
        )}
      </Flex>
      <ContentBox mt={3}>
        <MemberInfoCardGuts user={user} member={member} showMenu={showMenu} />
      </ContentBox>
    </>
  );
};

export default MemberInfoCard;
