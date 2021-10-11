import React from 'react';
import { Flex, Box, Skeleton } from '@chakra-ui/react';
import { format } from 'date-fns';

import TextBox from './TextBox';
import ProfileMenu from './profileMenu';
import AddressAvatar from './addressAvatar';
import UberHausMemberAvatar from './uberHausMemberAvatar';

const UberHausMemberInfoGuts = ({ member, showMenu }) => {
  console.log(member);
  return (
    <>
      {member && (
        <>
          <Flex justify='space-between'>
            <UberHausMemberAvatar
              addr={member.uberMinion.molochAddress}
              metadata={member.uberMeta}
              hideCopy
              alwaysShowName
            />
            {showMenu ? <ProfileMenu member={member} /> : null}
          </Flex>
          <Box>
            <TextBox size='xs' mt={6}>
              Current Delegate
            </TextBox>
            <Flex justify='space-between' mt={3}>
              <AddressAvatar addr={member.delegateKey} alwaysShowName />
            </Flex>
          </Box>
          <Flex w='100%' justify='space-between' mt={6}>
            <Box>
              <TextBox size='xs'>Shares</TextBox>
              <Skeleton isLoaded={member?.shares}>
                <TextBox variant='value' size='xl'>
                  {member?.shares}
                </TextBox>
              </Skeleton>
            </Box>
            <Box>
              <TextBox size='xs'>Loot</TextBox>
              <Skeleton isLoaded={member?.loot}>
                <TextBox variant='value' size='xl'>
                  {member?.loot}
                </TextBox>
              </Skeleton>
            </Box>
            <Box>
              <TextBox size='xs'>Anniversary</TextBox>
              <Skeleton isLoaded={member?.createdAt}>
                <TextBox variant='value' size='xl'>
                  {format(new Date(member?.createdAt * 1000), 'MMMM d')}
                </TextBox>
              </Skeleton>
            </Box>
          </Flex>
        </>
      )}
    </>
  );
};

export default UberHausMemberInfoGuts;
