import React, { useState, useEffect } from 'react';
import { Flex, Box, Skeleton } from '@chakra-ui/react';
// import { timeToNow } from '../utils/general';
import { format } from 'date-fns';
import TextBox from './TextBox';
import UserAvatar from './userAvatar';
import ProfileMenu from './profileMenu';
import { handleGetProfile } from '../utils/3box';

const MemberInfoGuts = ({ member, showMenu }) => {
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

  return (
    <>
      {member && (
        <>
          <Flex justify='space-between'>
            {/* <Avatar
              name={member.memberAddress}
              src={makeBlockie(member.memberAddress)}
              size='md'
            /> */}
            <UserAvatar
              user={{ ...member, ...memberData }}
              copyEnabled={false}
            />
            {showMenu && <ProfileMenu member={member} />}
          </Flex>
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

export default MemberInfoGuts;
