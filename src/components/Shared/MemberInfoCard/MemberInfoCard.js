import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Flex, Box, Skeleton } from '@chakra-ui/core';
import { format } from 'date-fns';
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
      <Flex justify='space-between' ml={6}>
        <Box textTransform='uppercase' fontSize='sm' fontFamily='heading'>
          {theme.daoMeta.member} Info
        </Box>
        <Box
          textTransform='uppercase'
          fontSize='sm'
          fontFamily='heading'
          color='secondary.400'
          _hover={{ cursor: 'pointer' }}
          onClick={() =>
            history.push(`/dao/${dao.address}/profile/${user.username}`)
          }
        >
          View my profile
        </Box>
      </Flex>
      <MemberInfoCardGuts user={user} />
    </>
  );
};

export default MemberInfoCard;
