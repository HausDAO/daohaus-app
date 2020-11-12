import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/core';
import ProfileOverviewCard from '../../components/Profile/OverviewCard';
import {
  useMembers,
  useMemberWallet,
  useDaoGraphData,
} from '../../contexts/PokemolContext';
import ProfileActvityFeed from '../../components/Profile/ProfileActivityFeed';
import TokenList from '../../components/Shared/TokenList/TokenList';

const Profile = () => {
  const location = useLocation();
  const [members] = useMembers();
  const [memberWallet] = useMemberWallet();
  const [dao] = useDaoGraphData();

  const [tokenList, setTokenList] = useState(null);
  const [memberProfile, setMemberProfile] = useState(null);
  const [memberPercent, setMemberPercent] = useState(null);

  console.log(memberWallet);

  useEffect(() => {
    const profileAddress = location.pathname.split('profile/');

    if (members.length > 0) {
      members.forEach((member) => {
        if (
          profileAddress[1].toLowerCase() ===
          member?.memberAddress?.toLowerCase()
        ) {
          setMemberProfile(member);
          setMemberPercent(
            (+member?.shares + +member?.loot) /
              (+dao?.totalShares + +dao?.totalLoot),
          );
        }
      });
    }
  }, [members, location]);

  useEffect(() => {
    if (dao?.tokenBalances && memberPercent) {
      console.log(dao?.tokenBalances);
      const memberTokenShares = dao.tokenBalances.map((token) => {
        return {
          ...token,
          memberBalance:
            (token.contractBabeBalance + token.contractTokenBalance) *
            memberPercent,
        };
      });
      console.log(memberTokenShares);

      setTokenList(memberTokenShares);
    }
  }, [dao, memberPercent]);
  console.log(memberPercent);

  return (
    <Flex>
      <Box w='60%'>
        {memberProfile && <ProfileOverviewCard user={memberProfile} />}
        <TokenList tokenList={tokenList} />
      </Box>
      <Box pl={6}>
        <ProfileActvityFeed />
      </Box>
    </Flex>
  );
};

export default Profile;
