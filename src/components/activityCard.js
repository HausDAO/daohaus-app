import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Avatar,
  Skeleton,
  Heading,
  Flex,
  Box,
  Text,
  Badge,
} from '@chakra-ui/react';
import makeBlockie from 'ethereum-blockies-base64';

import { handleGetProfile } from '../utils/3box';
import { timeToNow } from '../utils/general';
import ContentBox from './ContentBox';

const handleName = (activity, profile) => {
  return profile ? profile?.name : activity?.memberAddress;
};

const handleAvatar = (activity, profile) => {
  if (profile?.image?.length) {
    const url = profile?.image[0].contentUrl;
    return (
      <Avatar
        // adds key to prevent react from skipping this render
        key={`profile${activity.memberAddress}`}
        name={profile?.name}
        size='sm'
        src={`https://ipfs.infura.io/ipfs/${url['/']}`}
      />
    );
  } else {
    return (
      <Avatar
        key={`no-profile${activity.memberAddress}`}
        name={activity?.memberAddress}
        size='sm'
        src={makeBlockie(activity?.memberAddress)}
      />
    );
  }
};

const ActivityCard = ({ activity, displayAvatar }) => {
  const [profile, setProfile] = useState(null);
  const { daochain, daoid } = useParams();

  useEffect(() => {
    let isCancelled = false;
    const getProfile = async () => {
      try {
        const newProfile = await handleGetProfile(activity.memberAddress);
        if (newProfile.status === 'error') return;
        if (!isCancelled) {
          setProfile(newProfile);
        }
      } catch (error) {
        console.log("MemberDoesn't have a profile");
      }
    };
    if (activity.memberAddress) {
      getProfile();
    }
    return () => {
      isCancelled = true;
    };
  }, [activity]);

  // const renderBadge = () => {
  //   if (activity && activity.voteBadge) {
  //     switch (activity.activityData.type) {
  //       case 'proposal': {
  //         return (
  //           <Badge variant='solid'>{activity.activityData.lastActivity}</Badge>
  //         );
  //       }
  //       case 'rage': {
  //         return (
  //           <Badge variant='solid' colorScheme='red'>
  //             Rage
  //           </Badge>
  //         );
  //       }
  //       case 'vote': {
  //         return (
  //           <Badge
  //             colorScheme={+activity.uintVote === 1 ? 'green' : 'red'}
  //             variant='solid'
  //           >
  //             {+activity.uintVote === 1 ? 'Yes' : 'No'}
  //           </Badge>
  //         );
  //       }
  //       default: {
  //         return null;
  //       }
  //     }
  //   }
  // };

  // ACTIVITY MODEL
  // TODO needs proposalId if applicable
  // activity: {
  //   title: String
  //   createdAt: INT date(UTC),
  //   voteBadge: Int,
  //   statusBadge: String,
  //   rageBadge: String
  //   status: String
  // }
  const name = handleName(activity, profile);
  return (
    <ContentBox mt={3}>
      <Skeleton isLoaded={activity}>
        <Flex direction='row' justifyContent='space-between'>
          <Flex direction='column'>
            {activity?.title && (
              <RouterLink
                to={
                  activity?.activityData?.type !== 'rage'
                    ? `/dao/${daochain}/${daoid}/proposals/${activity.proposalId}`
                    : '#'
                }
              >
                <Heading as='h4' size='sm'>
                  {name} {activity.title}
                </Heading>
              </RouterLink>
            )}
            <Flex direction='row' align='center' mt={3}>
              {activity?.voteBadge && (
                <Badge
                  mr={2}
                  variant='solid'
                  colorScheme={activity.voteBadge === 1 ? 'green' : 'red'}
                >
                  {activity.voteBadge && activity.voteBadge ? 'Yes' : 'No'}
                </Badge>
              )}
              {activity?.statusBadge && (
                <Badge variant='solid' mr={2}>
                  {activity.statusBadge}
                </Badge>
              )}
              {activity?.rageBadge && (
                <Badge variant='solid' colorScheme='red' mr={2}>
                  Rage
                </Badge>
              )}
              <Text as='i' fontSize='xs'>
                {activity?.createdAt ? timeToNow(activity.createdAt) : '--'}
              </Text>
            </Flex>
          </Flex>
          <Box
            as={RouterLink}
            to={
              activity?.activityData
                ? `/dao/${daochain}/${daoid}/profile/${activity.activityData.memberAddress}`
                : ''
            }
          >
            {displayAvatar && handleAvatar(activity, profile)}
          </Box>
        </Flex>
      </Skeleton>
    </ContentBox>
  );
};

export default ActivityCard;
