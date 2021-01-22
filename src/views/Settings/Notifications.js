import React from 'react';
import { Flex, Stack, Icon, Switch, Box, Button } from '@chakra-ui/react';
import { VscGear } from 'react-icons/vsc';
import ContentBox from '../../components/Shared/ContentBox';
import TextBox from '../../components/Shared/TextBox';

const messages = [
  {
    id: 'proposal-ready',
    label: 'Proposal Ready for Voting',
  },
  {
    id: 'proposal-sponsor',
    label: 'Proposal Needs Sponsor',
  },
  {
    id: 'proposal-closing',
    label: 'Proposal Needs a Vote',
  },
  {
    id: 'new-member',
    label: 'New Member is Official',
  },
  {
    id: 'rage-quit',
    label: 'New Ragequit',
  },
];

const channels = ['discord', 'twitter', 'email', 'telegram'];

const Notifications = () => {
  return (
    <>
      <Flex justify='space-around' mt='150px'>
        <Box w='45%'>
          <Flex justify='space-between'>
            <TextBox colorScheme='white' size='sm' mb={2}>
              Messages
            </TextBox>
            <Box color='secondary.500'>Request a new message</Box>
          </Flex>

          <Stack spacing={6}>
            {messages.map((message) => {
              return (
                <ContentBox as={Flex} justify='space-between' key={message.id}>
                  <TextBox size='sm'>{message.label}</TextBox>
                  <Flex align='center'>
                    <Icon
                      as={VscGear}
                      color='secondary.500'
                      w='25px'
                      h='25px'
                      mr={3}
                    />
                    <Switch id={message.id} colorScheme='green' />
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
            <Box color='secondary.500'>Request a new channel</Box>
          </Flex>

          <Stack spacing={6}>
            {channels.map((channel) => {
              return (
                <ContentBox as={Flex} justify='space-between' key={channel}>
                  <TextBox size='sm'>{channel}</TextBox>
                  <Flex align='center'>
                    <Icon
                      as={VscGear}
                      color='secondary.500'
                      w='25px'
                      h='25px'
                      mr={3}
                    />
                    <Switch id={channel.id} colorScheme='green' />
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
