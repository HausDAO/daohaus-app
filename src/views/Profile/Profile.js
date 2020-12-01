import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';

import ProfileOverviewCard from '../../components/Profile/OverviewCard';
import {
  useMembers,
  useMemberWallet,
  useRefetchQuery,
} from '../../contexts/PokemolContext';
import ProfileActvityFeed from '../../components/Profile/ProfileActivityFeed';
import TokenList from '../../components/Shared/TokenList/TokenList';

const Profile = () => {
  const params = useParams();
  const [members] = useMembers();
  const [memberWallet] = useMemberWallet();
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
    if (memberWallet) {
      setIsMember(
        memberWallet.memberAddress.toLowerCase === params.id.toLowerCase(),
      );
    }
  }, [memberWallet, params]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateRefetchQuery('daoMembers');
    }, 60000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  return (
    <Flex>
      <Box w='60%' pl={6}>
        {memberProfile && <ProfileOverviewCard user={memberProfile} />}
        <TokenList
          tokenList={memberProfile?.tokenBalances}
          isMember={isMember}
        />
      </Box>
      <Box pl={6}>
        <ProfileActvityFeed profileAddress={params.id} />
      </Box>
    </Flex>
  );
};

export default Profile;
