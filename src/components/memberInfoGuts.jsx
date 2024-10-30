import React from 'react';
import { Flex, Box, Skeleton } from '@chakra-ui/react';
import { format } from 'date-fns';

import AddressAvatar from './addressAvatar';
import ProfileMenu from './profileMenu';
import TextBox from './TextBox';

const MemberInfoGuts = ({ member, showMenu, hideCopy }) => {
  return (
    <>
      {member && (
        <>
          {member.isDao || member.isSafeMinion ? (
            <Flex justify='space-between'>
              <Flex direction='column'>
                <TextBox size='sm' mb={2}>
                  DAO
                </TextBox>
                {member.isDao ? (
                  <AddressAvatar
                    addr={member.memberAddress}
                    hideCopy={hideCopy}
                  />
                ) : (
                  <>
                    {member.isSafeMinion.minions.map(minion => (
                      <Box
                        key={minion.minionAddress}
                        mb={member.isSafeMinion.minions.length > 1 ? 2 : 0}
                      >
                        <AddressAvatar
                          addr={minion.molochAddress}
                          hideCopy={hideCopy}
                        />
                      </Box>
                    ))}
                  </>
                )}
              </Flex>
              {member.isSafeMinion && (
                <Flex direction='column'>
                  <TextBox size='sm' mb={2}>
                    Minion
                  </TextBox>
                  <AddressAvatar
                    addr={member.memberAddress}
                    hideCopy={hideCopy}
                  />
                </Flex>
              )}
            </Flex>
          ) : (
            <Flex justify='space-between'>
              <AddressAvatar addr={member.memberAddress} hideCopy={hideCopy} />
              {showMenu ? <ProfileMenu member={member} /> : null}
            </Flex>
          )}
          <Flex w='100%' justify='space-between' mt={6}>
            <Box w={['100%']}>
              <TextBox size='xs'>Shares</TextBox>
              <Skeleton isLoaded={member?.shares}>
                <TextBox variant='value' size='xl'>
                  {member?.shares}
                </TextBox>
              </Skeleton>
            </Box>
            <Box w={['100%']}>
              <TextBox size='xs'>Loot</TextBox>
              <Skeleton isLoaded={member?.loot}>
                <TextBox variant='value' size='xl'>
                  {member?.loot}
                </TextBox>
              </Skeleton>
            </Box>
            <Box w={['100%']}>
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

export default MemberInfoGuts;
