import React, { useState, useEffect } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { handleGetProfile } from '../utils/3box';
import { initTokenData } from '../utils/tokenValue';
import BankList from '../components/BankList';
import GenericModal from '../modals/genericModal';
import RageQuitForm from '../forms/rageQuit';
import ActivitiesFeed from '../components/activitiesFeed';
import ProfileCard from '../components/profileCard';
import { getProfileActivites } from '../utils/activities';
import MainViewLayout from '../components/mainViewLayout';
import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import UpdateDelegate from '../forms/updateDelegate';

const Profile = ({ members, overview, daoTokens, daoMember, activities }) => {
  const { userid, daochain } = useParams();
  const { address } = useInjectedProvider();
  const [memberEntity, setMemberEntity] = useState(null);
  const [profile, setProfile] = useState(null);
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
        if (profile.status === 'error') return;
        setProfile(profile);
      } catch (error) {
        console.error(error);
      }
    };
    if (userid && !profile) {
      getProfile();
    }
  }, [userid, profile]);

  useEffect(() => {
    const initMemberTokens = async tokensWithBalance => {
      const newTokenData = await initTokenData(tokensWithBalance);
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
          <GenericModal modalId='rageQuit' closeOnOverlayClick>
            <RageQuitForm overview={overview} daoMember={daoMember} />
          </GenericModal>
          <GenericModal modalId='updateDelegate' closeOnOverlayClick>
            <UpdateDelegate overview={overview} />
          </GenericModal>
          <ProfileCard
            overview={overview}
            daoTokens={daoTokens}
            ens={profile?.ens}
            profile={profile}
            memberEntity={memberEntity}
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
