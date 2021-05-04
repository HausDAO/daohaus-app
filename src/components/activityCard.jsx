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
import { timeToNow, truncateAddr } from '../utils/general';
import ContentBox from './ContentBox';
import { chainByName } from '../utils/chain';

const handleName = (activity, profile) => {
  if (profile?.name) {
    return profile.name;
  }
  if (profile?.ens) {
    return profile.ens;
  }
  return truncateAddr(activity?.memberAddress);
};

const handleAvatar = (activity, profile) => {
  if (profile?.image?.length) {
    const url = profile?.image[0].contentUrl;
    return (
      <Avatar
        key={`profile${activity.memberAddress}`}
        name={profile?.name}
        size='sm'
        src={`https://ipfs.infura.io/ipfs/${url['/']}`}
      />
    );
  }
  return (
    <Avatar
      key={`no-profile${activity.memberAddress}`}
      name={truncateAddr(activity?.memberAddress)}
      size='sm'
      src={makeBlockie(activity?.memberAddress)}
    />
  );
};

const ActivityCard = ({ activity, displayAvatar, isLink = true }) => {
  const [profile, setProfile] = useState(null);
  const { daochain, daoid } = useParams();

  useEffect(() => {
    let isCancelled = false;
    const getProfile = async () => {
      try {
        const newProfile = await handleGetProfile(activity.memberAddress);

        if (newProfile.status === 'error') {
          setProfile(null);
          return;
        }
        if (!isCancelled) {
          setProfile(newProfile);
        }
      } catch (error) {
        console.log("Member doesn't have a profile");
      }
    };
    if (activity.memberAddress) {
      getProfile();
    }
    return () => {
      isCancelled = true;
    };
  }, [activity.memberAddress]);

  const name = handleName(activity, profile);
  const chain = daochain || chainByName(activity?.daoData?.network)?.chain_id;
  const daoAddress = daoid || activity?.daoData?.contractAddress;

  const profileLink =
    chain && daoAddress && activity?.memberAddress
      ? `/dao/${chain}/${daoAddress}/profile/${activity.memberAddress}`
      : null;

  const proposalLink =
    chain && daoAddress && activity?.proposalId
      ? `/dao/${chain}/${daoAddress}/proposals/${activity.proposalId}`
      : null;

  return (
    <ContentBox mt={3}>
      <Skeleton isLoaded={activity}>
        {activity.daoData && (
          <Flex direction='row' justifyContent='space-between' mb={5}>
            <Heading size='xs' fontFamily='mono'>
              {activity.daoData.name}
            </Heading>
            <Badge mr={2} variant='outline'>
              {chainByName(activity.daoData.network).network}
            </Badge>
          </Flex>
        )}
        <Flex direction='row' justifyContent='space-between'>
          <Flex direction='column'>
            {activity?.title &&
              (isLink && proposalLink ? (
                <RouterLink to={proposalLink}>
                  <Heading as='h4' size='sm'>
                    {`${name} ${activity.title}`}
                  </Heading>
                </RouterLink>
              ) : (
                <Heading as='h4' size='sm'>
                  {`${name} ${activity.title}`}
                </Heading>
              ))}
            <Flex direction='row' align='center' mt={3}>
              {activity?.voteBadge && (
                <Badge
                  mr={2}
                  variant='solid'
                  colorScheme={activity.voteBadge === 1 ? 'green' : 'red'}
                >
                  {activity.voteBadge && activity.voteBadge === 1
                    ? 'Yes'
                    : 'No'}
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
              {activity?.yesVotes && activity.daoData && (
                <Badge
                  colorScheme='green'
                  variant={
                    +activity.yesVotes > +activity.noVotes &&
                    activity.status !== 'Failed'
                      ? 'solid'
                      : 'outline'
                  }
                  mr={3}
                >
                  {`${activity?.yesVotes ? activity.yesVotes : '--'} Yes`}
                </Badge>
              )}
              {activity?.noVotes && activity.daoData && (
                <Badge
                  colorScheme='red'
                  variant={
                    +activity.noVotes > +activity.yesVotes ? 'solid' : 'outline'
                  }
                >
                  {`${activity?.noVotes ? activity.noVotes : '--'} No`}
                </Badge>
              )}
              <Text as='i' fontSize='xs' ml={3}>
                {activity?.createdAt ? timeToNow(activity.createdAt) : '--'}
              </Text>
            </Flex>
          </Flex>
          {isLink && profileLink ? (
            <Box as={RouterLink} to={profileLink}>
              {displayAvatar && handleAvatar(activity, profile)}
            </Box>
          ) : (
            <Box>{displayAvatar && handleAvatar(activity, profile)}</Box>
          )}
        </Flex>
      </Skeleton>
    </ContentBox>
  );
};

export default ActivityCard;
