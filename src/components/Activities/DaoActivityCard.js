import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProfile } from '3box/lib/api';

import { timeToNow, truncateAddr } from '../../utils/helpers';
import {
  Avatar,
  Badge,
  Box,
  Flex,
  Heading,
  Skeleton,
  Text,
} from '@chakra-ui/core';
import makeBlockie from 'ethereum-blockies-base64';
// import { getProposalCountdownText } from '../../utils/proposal-helper';

// TODO: get getProposalCountdownText(activity) outside of dao context?

const DaoActivityCard = ({ activity, isLoaded }) => {
  const [profile, setProfile] = useState();

  useEffect(() => {
    const fetchProfile = async () => {
      let profileRes;
      try {
        profileRes = await getProfile(activity.activityData.memberAddress);
      } catch (err) {}
      setProfile(profileRes);
    };

    if (activity.activityData) {
      fetchProfile();
    }

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
          return <Badge>{activity.activityData.lastActivity}</Badge>;
        }
        case 'rage': {
          return <Badge colorScheme='red'>Rage</Badge>;
        }
        case 'vote': {
          return (
            <Badge colorScheme={activity.uintVote ? 'green' : 'red'}>
              {activity.uintVote ? 'Yes' : 'No'}
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
    <Box
      rounded='lg'
      bg='blackAlpha.600'
      borderWidth='1px'
      borderColor='whiteAlpha.200'
      p={6}
      m={6}
      mt={2}
    >
      <Link
        to={
          activity?.activityData?.type !== 'rage'
            ? `/dao/${activity.molochAddress}/proposals/${activity.proposalId}`
            : '#'
        }
      >
        <Skeleton isLoaded={isLoaded}>
          <Flex direction='row' justifyContent='space-between'>
            <Flex direction='column'>
              <Heading as='h4' size='sm'>
                {renderTitle()}
              </Heading>

              <Flex direction='row' justifyContent='space-between'>
                <Text>
                  {activity?.activityData?.createdAt
                    ? timeToNow(activity.activityData.createdAt)
                    : '--'}
                </Text>
                {renderBadge()}
              </Flex>
            </Flex>

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
              />
            )}
          </Flex>
        </Skeleton>
      </Link>
    </Box>
  );
};

export default DaoActivityCard;
