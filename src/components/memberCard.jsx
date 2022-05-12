import React from 'react';
import { Flex, Box, Badge } from '@chakra-ui/react';
import { format } from 'date-fns';

import AddressAvatar from './addressAvatar';
import EntityAvatar from './entityAvatar';
import useBoost from '../hooks/useBoost';
import StaticAvatar from './staticAvatar';

const MemberCard = ({ member, selectMember, selectedMember }) => {
  const { isActive } = useBoost();

  const handleSelect = () =>
    selectMember(prevMember => prevMember?.id !== member.id && member);

  return (
    <Flex
      h='60px'
      align='center'
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
      justify='space-between'
    >
      <Flex
        w={['50%', null, null, '43%']}
        direction='column'
        justify='space-between'
      >
        <Flex direction='row' justify='space-between' align='center'>
          {isActive('SPAM_FILTER') ? (
            <StaticAvatar
              address={member.memberAddress}
              avatarImg={null}
              name={null}
              hideCopy
            />
          ) : (
            <Box>
              {!member.isDao && !member.isSafeMinion ? (
                <AddressAvatar addr={member.memberAddress} hideCopy />
              ) : (
                <EntityAvatar member={member} />
              )}
            </Box>
          )}
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
      <Box
        w={['25%', null, null, '15%']}
        fontFamily='mono'
        textAlign={['right', null, null, 'center']}
      >
        {member?.shares || '--'}
      </Box>
      <Box
        w={['20%', null, null, '15%']}
        fontFamily='mono'
        textAlign={['right', null, null, 'center']}
      >
        {member?.loot || '--'}
      </Box>
      <Box d={['none', null, null, 'inline-block']} fontFamily='mono'>
        {format(new Date(+member?.createdAt * 1000), 'MMM. d, yyyy') || '--'}
      </Box>
    </Flex>
  );
};

export default MemberCard;
