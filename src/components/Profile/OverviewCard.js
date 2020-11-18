import React, { useState, useEffect } from 'react';
import { Box, Flex, Image, Skeleton } from '@chakra-ui/core';
import { format } from 'date-fns';
import makeBlockie from 'ethereum-blockies-base64';

import { truncateAddr, memberProfile } from '../../utils/helpers';
import {
  useEns,
  useDaoGraphData,
  useMembers,
} from '../../contexts/PokemolContext';
import ContentBox from '../Shared/ContentBox';
import TextBox from '../Shared/TextBox';
import ProfileMenu from '../Shared/ProfileMenu';

const OverviewCard = ({ user }) => {
  const [ens] = useEns();
  const [dao] = useDaoGraphData();
  const [members] = useMembers();
  const [member, setMember] = useState();

  const [ensName, setEnsName] = useState(null);

  useEffect(() => {
    if (user?.memberAddress) {
      setMember(user);
    } else {
      setMember(memberProfile(members, user.username));
    }
  }, [members, user]);

  useEffect(() => {
    const lookupEns = async () => {
      if (user?.memberAddress) {
        const result = await ens.provider.lookupAddress(user.memberAddress);
        console.log(result);
        setEnsName(result);
      }
    };
    lookupEns();
  }, [user, ens.provider]);

  return (
    <ContentBox as={Flex} p={6} w='100%' justify='space-between'>
      <Flex direction='row' width='50%'>
        <Flex direction='column' align='center' pr={5} minW='40%'>
          {user.profile.image && user.profile.image[0] ? (
            <Image
              w='100px'
              h='100px'
              rounded='full'
              src={`https://ipfs.infura.io/ipfs/${user.profile.image[0].contentUrl['/']}`}
            />
          ) : (
            <Image
              w='100px'
              h='100px'
              rounded='full'
              src={makeBlockie(user.username)}
            />
          )}
          <Skeleton isLoaded={user?.createdAt}>
            <Box fontFamily='heading' fontSize='xs' textAlign='center' mt={5}>
              Joined{' '}
              {user?.createdAt
                ? format(new Date(+user.createdAt * 1000), 'MMM. d, yyyy')
                : '--'}
            </Box>
          </Skeleton>
        </Flex>

        <Flex direction='column'>
          <Box fontSize='xl' fontFamily='heading'>
            {user?.profile.name || truncateAddr(user.username)}{' '}
            <span>{user.profile.emoji || ''} </span>
          </Box>
          {user.name ? (
            <Box fontSize='sm' fontFamily='mono'>
              {truncateAddr(user.username)}
            </Box>
          ) : null}
          {ensName && (
            <Box fontSize='sm' fontFamily='mono'>
              {ensName}
            </Box>
          )}
          {user.profile.description && (
            <Box fontSize='sm' fontFamily='mono'>
              {user.profile.description}
            </Box>
          )}
        </Flex>
      </Flex>
      <Flex w='48%' direction='column'>
        <Flex justify='space-between'>
          <Box>
            <TextBox fontSize='sm'>Total Stake</TextBox>
            <TextBox fontSize='4xl' variant='value'>
              $4,802.20
            </TextBox>
          </Box>
          <Box>
            <ProfileMenu member={user} />
          </Box>
        </Flex>
        <Flex justify='space-between' align='flex-end' mt={4}>
          <Box w='30%'>
            <TextBox fontSize='xs'>Power</TextBox>
            <Skeleton isLoaded={member?.shares && dao?.totalShares}>
              <TextBox fontSize='xl' variant='value'>
                {member?.shares &&
                  dao?.totalShares &&
                  ((member?.shares / dao?.totalShares) * 100).toFixed(1)}
                %
              </TextBox>
            </Skeleton>
          </Box>
          <Box w='30%'>
            <TextBox fontSize='xs'>Shares</TextBox>
            <Skeleton isLoaded={member?.shares >= 0}>
              <TextBox fontSize='xl' variant='value'>
                {member?.shares}
              </TextBox>
            </Skeleton>
          </Box>
          <Box w='30%'>
            <TextBox fontSize='xs'>Loot</TextBox>
            <Skeleton isLoaded={member?.loot >= 0}>
              <TextBox fontSize='xl' variant='value'>
                {member?.loot}
              </TextBox>
            </Skeleton>
          </Box>
        </Flex>
      </Flex>
    </ContentBox>
  );
};

export default OverviewCard;
