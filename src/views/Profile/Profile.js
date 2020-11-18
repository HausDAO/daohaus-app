import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/core';
import ProfileOverviewCard from '../../components/Profile/OverviewCard';
import { useMembers, useDaoGraphData } from '../../contexts/PokemolContext';
import ProfileActvityFeed from '../../components/Profile/ProfileActivityFeed';
import TokenList from '../../components/Shared/TokenList/TokenList';

const Profile = () => {
  const params = useParams();
  const [members] = useMembers();
  const [dao] = useDaoGraphData();
  const [tokenList, setTokenList] = useState(null);
  const [memberProfile, setMemberProfile] = useState(null);
  const [memberPercent, setMemberPercent] = useState(null);

  // TODO prices

  useEffect(() => {
    if (members.length > 0) {
      members.forEach((member) => {
        if (params.id.toLowerCase() === member?.memberAddress?.toLowerCase()) {
          setMemberProfile(member);
          setMemberPercent(
            (+member?.shares + +member?.loot) /
              (+dao?.totalShares + +dao?.totalLoot),
          );
        }
      });
    }
  }, [members, params, dao]);

  useEffect(() => {
    if (dao?.tokenBalances && memberPercent) {
      const memberTokenShares = dao.tokenBalances.map((token) => {
        return {
          ...token,
          tokenBalance: +token.tokenBalance * memberPercent,
        };
      });

      setTokenList(memberTokenShares);
    }
  }, [dao, memberPercent]);

  return (
    <Flex>
      <Box w='60%' pl={6}>
        {memberProfile && <ProfileOverviewCard user={memberProfile} />}
        <TokenList tokenList={tokenList} />
      </Box>
      <Box pl={6}>
        <ProfileActvityFeed profileAddress={params.id} />
      </Box>
    </Flex>
  );
};

export default Profile;
