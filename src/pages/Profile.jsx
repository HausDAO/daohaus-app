import React, { useState, useEffect } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import BankList from '../components/bankList';
import ActivitiesFeed from '../components/activitiesFeed';
import ProfileCard from '../components/profileCard';
import MainViewLayout from '../components/mainViewLayout';
import { getProfileActivites } from '../utils/activities';
import { handleGetProfile } from '../utils/3box';
import { initTokenData } from '../utils/tokenValue';

const Profile = ({ members, overview, daoTokens, activities }) => {
  const { userid, daochain } = useParams();
  const { address } = useInjectedProvider();
  const [profile, setProfile] = useState(null);

  const [memberEntity, setMemberEntity] = useState(null);
  const [tokensReceivable, setTokensReceivable] = useState([]);

  useEffect(() => {
    if (members) {
      setMemberEntity(
        members?.find(
          member =>
            member?.memberAddress?.toLowerCase() === userid?.toLowerCase(),
        ),
      );
    }
  }, [members]);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const profile = await handleGetProfile(userid);
        if (!profile) return;
        setProfile(profile);
      } catch (error) {
        console.error(error);
      }
    };
    if (userid) {
      getProfile();
    }
  }, [userid]);

  useEffect(() => {
    const initMemberTokens = async tokensWithBalance => {
      const newTokenData = await initTokenData(daochain, tokensWithBalance);
      setTokensReceivable(newTokenData);
    };
    if (memberEntity?.tokenBalances && daochain) {
      const tokensWithBalance = memberEntity.tokenBalances.filter(
        token => +token.tokenBalance > 0,
      );
      if (tokensWithBalance?.length) {
        initMemberTokens(tokensWithBalance);
      } else {
        setTokensReceivable([]);
      }
    }
  }, [memberEntity]);

  const hasBalance = () => {
    return (
      address &&
      address.toLowerCase() === userid.toLowerCase() &&
      tokensReceivable.length
    );
  };

  return (
    <MainViewLayout header='Profile' isDao>
      <Flex wrap='wrap'>
        <Box
          w={['100%', null, null, null, '60%']}
          pr={[0, null, null, null, 6]}
          pb={6}
        >
          <ProfileCard
            overview={overview}
            daoTokens={daoTokens}
            ens={profile?.ens}
            profile={profile}
            memberEntity={memberEntity}
            refreshProfile={setProfile}
          />
          <BankList
            tokens={tokensReceivable}
            hasBalance={hasBalance()}
            profile
          />
        </Box>
        <Box w={['100%', null, null, null, '40%']}>
          {activities && memberEntity && (
            <ActivitiesFeed
              limit={5}
              hydrateFn={getProfileActivites(memberEntity.memberAddress)}
              activities={activities}
            />
          )}
        </Box>
      </Flex>
    </MainViewLayout>
  );
};

export default Profile;
