import React, { useState, useEffect } from 'react';
import { Avatar, Flex, Skeleton, Box, Tooltip, Icon } from '@chakra-ui/react';
import { ethers } from 'ethers';
import makeBlockie from 'ethereum-blockies-base64';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { RiQuestionLine } from 'react-icons/ri';

import { handleGetProfile } from '../utils/3box';
import { truncateAddr, numberWithCommas } from '../utils/general';
import { initTokenData } from '../utils/tokenValue';
import BankList from '../components/BankList';
import GenericModal from '../modals/genericModal';
import RageQuitForm from '../forms/rageQuit';
import ActivitiesFeed from '../components/activitiesFeed';
import { getProfileActivites } from '../utils/activities';
import ProfileMenu from '../components/profileMenu';
import ContentBox from '../components/ContentBox';
import TextBox from '../components/TextBox';
import { chainByID } from '../utils/chain';
import { calcPower, calcValue } from '../utils/profile';

const Profile = ({ members, overview, daoTokens, daoMember, activities }) => {
  const { userid, daochain } = useParams();
  const [memberEntity, setMemberEntity] = useState(null);
  const [profile, setProfile] = useState(null);
  const [tokensReceivable, setTokensReceivable] = useState([]);
  const [ens, setEns] = useState(null);

  useEffect(() => {
    if (members) {
      setMemberEntity(
        members?.find(
          (member) =>
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
    const lookupEns = async () => {
      if (userid) {
        const ethersProvider = ethers.getDefaultProvider(
          chainByID('0x1').rpc_url,
        );
        const result = await ethersProvider.lookupAddress(userid);
        if (result) {
          setEns(result);
        }
      }
    };
    lookupEns();
  }, [daochain, userid]);

  useEffect(() => {
    const initMemberTokens = async (tokensWithBalance) => {
      const newTokenData = await initTokenData(tokensWithBalance);
      setTokensReceivable(newTokenData);
    };
    if (memberEntity?.tokenBalances && daochain) {
      const tokensWithBalance = memberEntity.tokenBalances.filter(
        (token) => +token.tokenBalance > 0,
      );
      if (tokensWithBalance?.length) {
        initMemberTokens(tokensWithBalance);
      } else {
        setTokensReceivable([]);
      }
    }
  }, [memberEntity]);

  const handleAvatar = (member, profile) => {
    if (profile?.image?.length) {
      const url = profile?.image[0].contentUrl;
      return (
        <Avatar
          key={`profile${member}`}
          name={profile?.name}
          width='100px'
          height='100px'
          src={`https://ipfs.infura.io/ipfs/${url['/']}`}
        />
      );
    } else {
      return (
        <Avatar
          key={`no-profile${userid}`}
          name={userid}
          width='100px'
          height='100px'
          src={makeBlockie(userid)}
        />
      );
    }
  };

  const handleName = (profile) => {
    return profile?.name ? profile.name : truncateAddr(userid);
  };

  return (
    <Flex wrap='wrap'>
      <Box
        w={['100%', null, null, null, '60%']}
        pr={[0, null, null, null, 6]}
        pb={6}
      >
        <GenericModal modalId='rageQuit' closeOnOverlayClick={true}>
          <RageQuitForm overview={overview} daoMember={daoMember} />
        </GenericModal>
        <ContentBox as={Flex} p={6} w='100%' justify='space-between'>
          {userid ? (
            <>
              <Flex direction='row' width='50%'>
                <Flex direction='column' align='center' pr={5} minW='40%'>
                  {handleAvatar(userid, profile)}
                  <Box
                    fontFamily='heading'
                    fontSize='xs'
                    textAlign='center'
                    mt={5}
                  >
                    {memberEntity?.exists ? (
                      <>
                        Joined{' '}
                        {memberEntity?.createdAt
                          ? format(
                              new Date(+memberEntity?.createdAt * 1000),
                              'MMM. d, yyyy',
                            )
                          : '--'}
                      </>
                    ) : (
                      <>Not a member of this DAO</>
                    )}
                  </Box>
                </Flex>

                <Flex direction='column'>
                  <Box fontSize='xl' fontFamily='heading'>
                    {handleName(profile)}
                    {profile?.emoji && (
                      <Box as='span' ml={2}>
                        {profile.emoji}
                      </Box>
                    )}
                  </Box>
                  {ens && (
                    <Box fontSize='sm' fontFamily='mono'>
                      {ens}
                    </Box>
                  )}
                  {profile?.description && (
                    <Box fontSize='sm' fontFamily='mono'>
                      {profile?.description}
                    </Box>
                  )}
                </Flex>
              </Flex>
              <Flex w='48%' direction='column'>
                <Flex justify='space-between'>
                  <Box>
                    <TextBox size='sm'>
                      Exit Amount
                      <Tooltip
                        hasArrow
                        shouldWrapChildren
                        placement='top'
                        label='Estimated amount you would receive in tokens if you were to Ragequit'
                      >
                        <Icon mt='-4px' as={RiQuestionLine} />
                      </Tooltip>
                    </TextBox>
                    <TextBox size='4xl' variant='value'>
                      $
                      {daoTokens &&
                        overview &&
                        numberWithCommas(
                          calcValue(memberEntity, daoTokens, overview),
                        )}
                    </TextBox>
                  </Box>
                  <Box>
                    {profile ? (
                      <ProfileMenu member={{ ...memberEntity, ...profile }} />
                    ) : null}
                  </Box>
                </Flex>
                <Flex justify='space-between' align='flex-end' mt={4}>
                  <Box w='30%'>
                    <TextBox size='xs'>Power</TextBox>
                    <Skeleton isLoaded={profile || memberEntity}>
                      <TextBox size='xl' variant='value'>
                        {daoTokens &&
                          overview &&
                          calcPower(memberEntity, overview)}
                        %
                      </TextBox>
                    </Skeleton>
                  </Box>
                  <Box w='30%'>
                    <TextBox size='xs'>Shares</TextBox>
                    <Skeleton isLoaded={memberEntity?.shares >= 0}>
                      <TextBox size='xl' variant='value'>
                        {memberEntity?.shares}
                      </TextBox>
                    </Skeleton>
                  </Box>
                  <Box w='30%'>
                    <TextBox size='xs'>Loot</TextBox>
                    <Skeleton isLoaded={memberEntity?.loot >= 0}>
                      <TextBox size='xl' variant='value'>
                        {memberEntity?.loot}
                      </TextBox>
                    </Skeleton>
                  </Box>
                </Flex>
              </Flex>
            </>
          ) : null}
        </ContentBox>
        <BankList
          tokens={tokensReceivable}
          hasBalance={tokensReceivable.length}
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
  );
};

export default Profile;
