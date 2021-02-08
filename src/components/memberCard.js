import React, { useState, useEffect } from 'react';
import { Flex, Box, Skeleton, Badge } from '@chakra-ui/react';
import { format } from 'date-fns';
import UserAvatar from '../components/userAvatar';
import { handleGetProfile } from '../utils/3box';

const MemberCard = ({ member, selectMember, selectedMember }) => {
  const [memberData, setMemberData] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const profile = await handleGetProfile(member.memberAddress);
        if (profile.status === 'error') {
          return;
        }
        setMemberData(profile);
      } catch (error) {
        console.log("Member doesn't have a profile");
      }
    };

    getProfile();
  }, [member]);

  const handleSelect = () => {
    if (memberData) {
      selectMember({ ...member, ...memberData, hasProfile: true });
    } else {
      selectMember(member);
    }
  };

  return (
    <Flex
      h='60px'
      align='center'
      pl={3}
      bg={
        member?.memberAddress === selectedMember?.memberAddress // && member.memberAddress === address.toLowerCase()
          ? 'primary.500'
          : null
      }
      _hover={{
        cursor: 'pointer',
        background: 'primary.500',
        borderRadius: '4px',
      }}
      onClick={handleSelect}
    >
      <Flex w='43%' direction='column' justify='space-between'>
        <Flex direction='row' justify='space-between' align='center'>
          <UserAvatar user={{ ...member, ...memberData }} copyEnabled={false} />
          {member.jailed ? (
            <Badge variant='solid' colorScheme='red' mr={5} height='100%'>
              JAILED
            </Badge>
          ) : null}

          {!member.jailed && member.shares === '0' && member.loot === '0' ? (
            <Badge variant='solid' colorScheme='secondary' mr={5} height='100%'>
              INACTIVE
            </Badge>
          ) : null}
        </Flex>
      </Flex>
      <Box w='15%'>
        <Skeleton isLoaded={member?.shares}>
          <Box fontFamily='mono'>{member.shares || '--'}</Box>
        </Skeleton>
      </Box>
      <Box w='15%'>
        <Skeleton isLoaded={member?.loot}>
          <Box fontFamily='mono'>{member.loot || '--'}</Box>
        </Skeleton>
      </Box>
      <Box>
        <Skeleton isLoaded={member?.createdAt}>
          <Box fontFamily='mono'>
            {format(new Date(+member.createdAt * 1000), 'MMM. d, yyyy') || '--'}
          </Box>
        </Skeleton>
      </Box>
    </Flex>
  );
};

export default MemberCard;
