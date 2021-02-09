import React from 'react';
import { Flex, Box, Badge } from '@chakra-ui/react';
import { format } from 'date-fns';
import AddressAvatar from './addressAvatar';

const MemberCard = ({ member, selectMember, selectedMember }) => {
  const handleSelect = () => {
    selectMember(member);
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
          <AddressAvatar addr={member.memberAddress} hideCopy={true} />
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
        <Box fontFamily='mono'>{member?.shares || '--'}</Box>
      </Box>
      <Box w='15%'>
        <Box fontFamily='mono'>{member?.loot || '--'}</Box>
      </Box>
      <Box>
        <Box fontFamily='mono'>
          {format(new Date(+member?.createdAt * 1000), 'MMM. d, yyyy') || '--'}
        </Box>
      </Box>
    </Flex>
  );
};

export default MemberCard;
