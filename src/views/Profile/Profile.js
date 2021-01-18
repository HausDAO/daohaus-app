import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';

import ProfileOverviewCard from '../../components/Profile/ProfileOverviewCard';
import {
  useMembers,
  useRefetchQuery,
  useUser,
} from '../../contexts/PokemolContext';
import ProfileActvityFeed from '../../components/Profile/ProfileActivityFeed';
import TokenList from '../../components/Shared/TokenList/TokenList';

const Profile = () => {
  const params = useParams();
  const [members] = useMembers();
  const [user] = useUser();
  const [memberProfile, setMemberProfile] = useState(null);
  const [, updateRefetchQuery] = useRefetchQuery();
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    if (members.length > 0) {
      setMemberProfile(
        members.find(
          (member) =>
            member.memberAddress.toLowerCase() === params.id.toLowerCase(),
        ),
      );
    }
  }, [members, params]);

  useEffect(() => {
    if (user) {
      setIsMember(user.username.toLowerCase() === params.id.toLowerCase());
    }
  }, [params, user]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateRefetchQuery('daoMembers');
    }, 60000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  return (
    <Flex wrap='wrap' p={6}>
      <Box
        w={['100%', null, null, null, '60%']}
        pr={[0, null, null, null, 6]}
        pb={6}
      >
        <ProfileOverviewCard profile={memberProfile || user} />
        <TokenList
          tokenList={memberProfile?.tokenBalances}
          isMember={isMember}
        />
      </Box>
      <Box w={['100%', null, null, null, '40%']}>
        <ProfileActvityFeed profileAddress={params.id} />
      </Box>
    </Flex>
  );
};

export default Profile;
