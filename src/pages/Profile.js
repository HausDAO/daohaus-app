import React, { useState, useEffect } from 'react';
import { Avatar, Flex, Skeleton, Box, Tooltip, Icon } from '@chakra-ui/react';
import { ethers } from 'ethers';
import makeBlockie from 'ethereum-blockies-base64';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { RiQuestionLine } from 'react-icons/ri';
import { FaStar } from 'react-icons/fa';

import { handleGetProfile } from '../utils/3box';
import { truncateAddr, numberWithCommas } from '../utils/general';
import { initTokenData } from '../utils/tokenValue';
import BankList from '../components/BankList';
// import ProfileBankList from '../components/profileBankList';
import ActivitiesFeed from '../components/activitiesFeed';
import { getProfileActivites } from '../utils/activities';
import ProfileMenu from '../components/profileMenu';
import ContentBox from '../components/ContentBox';
import TextBox from '../components/TextBox';
import { chainByID } from '../utils/chain';
import { calcPower, calcValue } from '../utils/profile';

const Profile = ({ members, overview, daoTokens, activities }) => {
  // is address
  // exists, doesn't exist has balance, no entity

  console.log('members', members);

  const { userid, daochain } = useParams();

  const [tokensRecievable, setTokensRecievable] = useState([]);
  const [profile, setProfile] = useState(null);
  const [showAlert] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [ens, setEns] = useState(null);

  useEffect(() => {
    setCurrentMember(
      members?.find(
        (member) =>
          member?.memberAddress?.toLowerCase() === userid?.toLowerCase(),
      ),
    );
  }, []);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const profile = await handleGetProfile(currentMember.memberAddress);
        if (profile.status === 'error') return;
        setProfile(profile);
      } catch (error) {
        console.error(error);
      }
    };
    if (currentMember && !profile) {
      getProfile();
    }
  }, [currentMember, profile]);

  useEffect(() => {
    const lookupEns = async () => {
      if (currentMember?.memberAddress) {
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
  }, [currentMember, daochain, userid]);

  useEffect(() => {
    const initMemberTokens = async (tokensWithBalance) => {
      const newTokenData = await initTokenData(tokensWithBalance);
      setTokensRecievable(newTokenData);
    };
    if (currentMember?.tokenBalances && daochain) {
      const tokensWithBalance = currentMember.tokenBalances.filter(
        (token) => +token.tokenBalance > 0,
      );
      if (tokensWithBalance?.length) {
        initMemberTokens(tokensWithBalance);
      } else {
        setTokensRecievable([]);
      }
    }
  }, [currentMember]);

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
          key={`no-profile${member}`}
          name={member?.memberAddress}
          width='100px'
          height='100px'
          src={makeBlockie(member?.memberAddress)}
        />
      );
    }
  };

  const handleName = (member, profile) => {
    return profile?.name ? profile.name : truncateAddr(member.memberAddress);
  };

  return (
    <Flex wrap='wrap'>
      <Box
        w={['100%', null, null, null, '60%']}
        pr={[0, null, null, null, 6]}
        pb={6}
      >
        <ContentBox as={Flex} p={6} w='100%' justify='space-between'>
          {currentMember ? (
            <>
              <Flex direction='row' width='50%'>
                <Flex direction='column' align='center' pr={5} minW='40%'>
                  {handleAvatar(currentMember, profile)}
                  <Skeleton isLoaded={profile || currentMember}>
                    {currentMember?.memberAddress ? (
                      <Box
                        fontFamily='heading'
                        fontSize='xs'
                        textAlign='center'
                        mt={5}
                      >
                        Joined{' '}
                        {currentMember?.createdAt
                          ? format(
                              new Date(+currentMember?.createdAt * 1000),
                              'MMM. d, yyyy',
                            )
                          : '--'}
                      </Box>
                    ) : null}
                  </Skeleton>
                </Flex>

                <Flex direction='column'>
                  <Box fontSize='xl' fontFamily='heading'>
                    {handleName(currentMember, profile)}
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
                          calcValue(currentMember, daoTokens, overview),
                        )}
                    </TextBox>
                  </Box>
                  <Box>
                    {profile ? (
                      <ProfileMenu member={{ ...currentMember, ...profile }} />
                    ) : null}
                  </Box>
                </Flex>
                <Flex justify='space-between' align='flex-end' mt={4}>
                  <Box w='30%'>
                    <TextBox size='xs'>Power</TextBox>
                    <Skeleton isLoaded={profile || currentMember}>
                      {showAlert ? (
                        <TextBox size='xl' variant='value'>
                          <Flex
                            direction='row'
                            align='center'
                            justify='space-around'
                          >
                            <Icon as={FaStar} color='yellow.500' />
                            100%
                            <Icon as={FaStar} color='yellow.500' />
                          </Flex>
                        </TextBox>
                      ) : (
                        <TextBox size='xl' variant='value'>
                          {daoTokens &&
                            overview &&
                            calcPower(currentMember, overview)}
                          %
                        </TextBox>
                      )}
                    </Skeleton>
                  </Box>
                  <Box w='30%'>
                    <TextBox size='xs'>Shares</TextBox>
                    <Skeleton isLoaded={currentMember?.shares >= 0}>
                      <TextBox size='xl' variant='value'>
                        {currentMember?.shares}
                      </TextBox>
                    </Skeleton>
                  </Box>
                  <Box w='30%'>
                    <TextBox size='xs'>Loot</TextBox>
                    <Skeleton isLoaded={currentMember?.loot >= 0}>
                      <TextBox size='xl' variant='value'>
                        {currentMember?.loot}
                      </TextBox>
                    </Skeleton>
                  </Box>
                </Flex>
              </Flex>
            </>
          ) : (
            <h3>Member not found</h3>
          )}
        </ContentBox>
        <BankList
          tokens={tokensRecievable}
          hasBalance={tokensRecievable.length}
        />
      </Box>
      <Box w={['100%', null, null, null, '40%']}>
        {activities && currentMember && (
          <ActivitiesFeed
            limit={5}
            hydrateFn={getProfileActivites(currentMember.memberAddress)}
            activities={activities}
          />
        )}
      </Box>
    </Flex>
  );
};

export default Profile;
