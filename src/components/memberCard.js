import React, { useState, useEffect } from 'react';
import makeBlockie from 'ethereum-blockies-base64';
import { Avatar, Flex, Box, Skeleton } from '@chakra-ui/react';
import { format } from 'date-fns';
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
        console.log("MemberDoesn't have a profile");
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
  console.log(memberData);
  console.log(member);

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
        {member && memberData?.image?.length ? (
          <Avatar
            name={memberData.name}
            src={`https://ipfs.infura.io/ipfs/${memberData.image[0].contentUrl['/']}`}
            size='md'
          />
        ) : (
          <Avatar
            name={member.memberAddress}
            src={makeBlockie(member.memberAddress)}
            size='md'
          />
        )}
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
