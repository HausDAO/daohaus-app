import React from 'react';
import { RiQuestionLine } from 'react-icons/ri';
import { useParams } from 'react-router-dom';
import {
  Avatar,
  Flex,
  Skeleton,
  Box,
  Tooltip,
  Icon,
  Link,
} from '@chakra-ui/react';
import makeBlockie from 'ethereum-blockies-base64';
import { format } from 'date-fns';

import ContentBox from './ContentBox';
import ProfileMenu from './profileMenu';
import TextBox from './TextBox';
import { truncateAddr, numberWithCommas, isDelegating } from '../utils/general';
import { calcPower, calcValue } from '../utils/profile';

const ProfileCard = ({
  overview,
  daoTokens,
  ens,
  profile,
  memberEntity,
  refreshProfile,
}) => {
  const { userid } = useParams();
  const handleAvatar = (member, profile) => {
    if (profile?.image?.original?.src) {
      return (
        <Avatar
          key={`profile${member}`}
          name={profile?.name}
          width='100px'
          height='100px'
          src={`https://ipfs.infura.io/ipfs/${
            profile?.image.original.src.match('(?<=ipfs://).+')[0]
          }`}
        />
      );
    }

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
    }
    return (
      <Avatar
        key={`no-profile${userid}`}
        name={userid}
        width='100px'
        height='100px'
        src={makeBlockie(userid)}
      />
    );
  };

  const handleName = profile => {
    return profile?.name ? profile.name : truncateAddr(userid);
  };

  return (
    <ContentBox>
      {userid ? (
        <Flex w='100%' justify='space-between' wrap='wrap'>
          <Flex direction='row' w={['100%', null, null, '50%']}>
            <Flex
              direction='column'
              align={['start', null, null, 'center']}
              pr={5}
              minW='40%'
            >
              {handleAvatar(userid, profile)}
              <Box fontFamily='heading' fontSize='xs' textAlign='center' mt={5}>
                {memberEntity?.exists ? (
                  <>
                    {`Joined
                    ${
                      memberEntity?.createdAt
                        ? format(
                            new Date(+memberEntity?.createdAt * 1000),
                            'MMM. d, yyyy',
                          )
                        : '--'
                    }`}
                  </>
                ) : (
                  <>Not a member of this DAO</>
                )}
              </Box>
            </Flex>

            <Flex direction='column' align='start'>
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
          <Flex
            direction='column'
            w={['100%', null, null, '50%']}
            mt={[4, null, null, 0]}
          >
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
                <TextBox fontSize={['xl', null, null, '4xl']} variant='value'>
                  $
                  {daoTokens &&
                    overview &&
                    numberWithCommas(
                      calcValue(memberEntity, daoTokens, overview),
                    )}
                </TextBox>
              </Box>
              <Box>
                {memberEntity && (
                  <ProfileMenu
                    member={{ ...memberEntity, ...profile }}
                    refreshProfile={refreshProfile}
                  />
                )}
              </Box>
            </Flex>
            <Flex justify='space-between' align='flex-end' mt={4}>
              <Box w='30%'>
                <TextBox size='xs'>Power</TextBox>
                <Skeleton isLoaded={profile || memberEntity}>
                  <TextBox size='xl' variant='value'>
                    {daoTokens && overview && calcPower(memberEntity, overview)}
                    %
                  </TextBox>
                </Skeleton>
              </Box>
              <Box w='30%'>
                <TextBox size='xs'>Shares</TextBox>
                <Skeleton isLoaded={!memberEntity || memberEntity?.shares >= 0}>
                  <TextBox size='xl' variant='value'>
                    {memberEntity?.shares || '0'}
                  </TextBox>
                </Skeleton>
              </Box>
              <Box w='30%'>
                <TextBox size='xs'>Loot</TextBox>
                <Skeleton isLoaded={!memberEntity || memberEntity?.loot >= 0}>
                  <TextBox size='xl' variant='value'>
                    {memberEntity?.loot || '0'}
                  </TextBox>
                </Skeleton>
              </Box>
            </Flex>
          </Flex>
          {memberEntity && isDelegating(memberEntity) && (
            <TextBox size='xs' mt={3}>
              <Box>Is delegating power to</Box>
              <Link color='secondary.300' href='/'>
                {truncateAddr(memberEntity?.delegateKey)}
              </Link>
            </TextBox>
          )}
        </Flex>
      ) : null}
    </ContentBox>
  );
};

export default ProfileCard;
