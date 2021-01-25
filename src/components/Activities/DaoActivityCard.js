import React, { useEffect, useState } from 'react';
import { getProfile } from '3box/lib/api';
import { Link as RouterLink } from 'react-router-dom';

import { timeToNow, truncateAddr } from '../../utils/helpers';
import {
  Avatar,
  Box,
  Badge,
  Heading,
  Flex,
  Skeleton,
  Text,
} from '@chakra-ui/react';
import makeBlockie from 'ethereum-blockies-base64';

import ContentBox from '../Shared/ContentBox';

const DaoActivityCard = ({ activity, isLoaded }) => {
  const [profile, setProfile] = useState();

  useEffect(() => {
    let isCancelled = false;
    const fetchProfile = async () => {
      let profileRes;
      try {
        profileRes = await getProfile(activity.activityData.memberAddress);
      } catch (err) {}

      if (!isCancelled) {
        setProfile(profileRes);
      }
    };

    if (activity.activityData) {
      fetchProfile();
    }

    return () => {
      isCancelled = true;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity]);

  const renderTitle = () => {
    if (activity && activity.activityData) {
      return `${profile?.name ||
        truncateAddr(activity.activityData.memberAddress)} ${
        activity.activityData.title
      }`;
    } else {
      return '--';
    }
  };

  const renderBadge = () => {
    if (activity && activity.activityData) {
      switch (activity.activityData.type) {
        case 'proposal': {
          return (
            <Badge variant='solid'>{activity.activityData.lastActivity}</Badge>
          );
        }
        case 'rage': {
          return (
            <Badge variant='solid' colorScheme='red'>
              Rage
            </Badge>
          );
        }
        case 'vote': {
          return (
            <Badge
              colorScheme={+activity.uintVote === 1 ? 'green' : 'red'}
              variant='solid'
            >
              {+activity.uintVote === 1 ? 'Yes' : 'No'}
            </Badge>
          );
        }
        default: {
          return null;
        }
      }
    }
  };

  return (
    <ContentBox mt={3}>
      <Skeleton isLoaded={isLoaded}>
        <Flex direction='row' justifyContent='space-between'>
          <Flex direction='column'>
            <RouterLink
              to={
                activity?.activityData?.type !== 'rage'
                  ? `/dao/${activity.molochAddress}/proposals/${activity.proposalId}`
                  : '#'
              }
            >
              <Heading as='h4' size='sm'>
                {renderTitle()}
              </Heading>
            </RouterLink>
            <Flex direction='row' align='center'>
              <Box mr={2}>{renderBadge()}</Box>
              <Text as='i' fontSize='xs'>
                {activity?.activityData?.createdAt
                  ? timeToNow(activity.activityData.createdAt)
                  : '--'}
              </Text>
            </Flex>
          </Flex>
          <Box
            as={RouterLink}
            to={
              activity?.activityData
                ? `/dao/${activity.molochAddress}/profile/${activity.activityData.memberAddress}`
                : ''
            }
          >
            {profile && profile.image ? (
              <Avatar
                src={`${'https://ipfs.infura.io/ipfs/' +
                  profile.image[0].contentUrl['/']}`}
                mr={3}
                size='sm'
              ></Avatar>
            ) : (
              <Avatar
                src={makeBlockie(
                  activity?.activityData?.memberAddress || '0x0',
                )}
                mr={3}
                size='sm'
              />
            )}
          </Box>
        </Flex>
      </Skeleton>
    </ContentBox>
  );
};

export default DaoActivityCard;
