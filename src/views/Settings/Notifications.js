import React from 'react';
import { Flex, Stack, Icon, Switch, Box, Button } from '@chakra-ui/react';
import { VscGear } from 'react-icons/vsc';

import ContentBox from '../../components/Shared/ContentBox';
import TextBox from '../../components/Shared/TextBox';
import { notificationBoostContent } from '../../content/boost-content';

const Notifications = () => {
  return (
    <>
      <Flex justify='space-around' mt='150px'>
        <Box w='45%'>
          <Flex justify='space-between'>
            <TextBox colorScheme='white' size='sm' mb={2}>
              Messages
            </TextBox>
            {/* <Box color='secondary.500'>Request a new message</Box> */}
          </Flex>

          <Stack spacing={6}>
            {notificationBoostContent.actions.map((message) => {
              return (
                <ContentBox
                  as={Flex}
                  justify='space-between'
                  key={message.label}
                >
                  <TextBox size='sm'>{message.label}</TextBox>
                  <Flex align='center'>
                    {message.comingSoon ? (
                      <TextBox size='xs'>Coming Soon</TextBox>
                    ) : (
                      <Switch id={message.id} colorScheme='green' />
                    )}
                  </Flex>
                </ContentBox>
              );
            })}
          </Stack>
        </Box>
        <Box w='45%'>
          <Flex justify='space-between'>
            <TextBox colorScheme='white' size='sm' mb={2}>
              Channels
            </TextBox>
            {/* <Box color='secondary.500'>Request a new channel</Box> */}
          </Flex>

          <Stack spacing={6}>
            {notificationBoostContent.channels.map((channel) => {
              return (
                <ContentBox
                  as={Flex}
                  justify='space-between'
                  key={channel.name}
                >
                  <TextBox size='sm'>{channel.name}</TextBox>
                  <Flex align='center'>
                    {channel.comingSoon ? (
                      <TextBox size='xs'>Coming Soon</TextBox>
                    ) : (
                      <>
                        <Icon
                          as={VscGear}
                          color='secondary.500'
                          w='25px'
                          h='25px'
                          mr={3}
                        />
                        <Switch id={channel.id} colorScheme='green' />
                      </>
                    )}
                  </Flex>
                </ContentBox>
              );
            })}
          </Stack>
        </Box>
      </Flex>
      <Flex justify='flex-end' w='100%'>
        <Button mr='2.5%'>Save Changes</Button>
      </Flex>
    </>
  );
};

export default Notifications;
