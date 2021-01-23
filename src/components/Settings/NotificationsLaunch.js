import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Heading,
  Input,
  Link,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { useDao } from '../../contexts/PokemolContext';
import { notificationBoostContent } from '../../content/boost-content';
import { get } from '../../utils/requests';

const NotificationsLaunch = ({ handleLaunch, loading, setLoading }) => {
  const [dao] = useDao();
  const { handleSubmit, register, getValues } = useForm();
  const [connectionError, setConnectionError] = useState();
  const [isConnected, setIsConnected] = useState();

  const [step, setStep] = useState('intro');

  const onSubmit = async (values) => {
    const boostMetadata = [
      {
        discord: {
          channelId: values.channelId,
        },
        actions: ['votingPeriod', 'rageQuit', 'newProposal'],
      },
    ];
    handleLaunch(boostMetadata);
    setStep('success');
  };

  const testConnection = async () => {
    setLoading(true);
    const values = getValues();

    // TODO: ERROR ON 'SUCCESS'
    const res = await get(`dao/discord-status/${values.channelId}`);

    console.log('res', res);
    if (res.error) {
      setConnectionError(res.error);
    } else {
      setIsConnected(true);
    }

    setLoading(false);
  };

  return (
    <>
      {step === 'intro' ? (
        <>
          <Heading as='h4' size='md' fontWeight='100'>
            Add Notifications Level 1
          </Heading>
          <Text my={6}>
            Hook up dao activity notifications to your Discord server.
          </Text>
          <Button onClick={() => setStep('directions1')}>Get Started</Button>
        </>
      ) : null}

      {step === 'directions1' ? (
        <>
          <Heading as='h4' size='md' fontWeight='100'>
            Notification Level 1 - Setup Instructions
          </Heading>
          <Text mt={6} fontWeight={700}>
            Step 1
          </Text>
          <Text>Invite Haus Bot to your discord server</Text>
          <Text fontSize='sm' my={6}>
            <Link
              href={notificationBoostContent.inviteLinks.discord}
              isExternal
            >
              {notificationBoostContent.inviteLinks.discord}
            </Link>
          </Text>
          <Text fontSize='xs' mb={6}>
            Open that url in a browser where you are logged into Discord, and
            you will see a menu letting you add the bot to servers you have
            access to. Add it to the server in question, giving it permissions
            indicated.
          </Text>

          <Button onClick={() => setStep('directions2')}>Next</Button>
        </>
      ) : null}

      {step === 'directions2' ? (
        <>
          <Heading as='h4' size='md' fontWeight='100'>
            Notification Level 1 - Setup Instructions
          </Heading>
          <Text mt={6} fontWeight={700}>
            Step 2
          </Text>
          <Text mb={6}>Get the Discord channel ID</Text>
          <Text mb={3} fontSize='xs'>
            In Discord, open your User Settings -> Appearance -> Enable
            Developer Mode. Right click on the Discord text channel you want the
            bot to interact with and press “Copy ID”.
          </Text>
          <Text fontSize='xs'>
            You need to ensure the new ‘Haus Bot’ role is able to view this
            channel. If the channel is not public for @everyone on the server,
            you will need to add the Haus Bot roll into the channel permissions.
          </Text>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box mt={6}>
              <FormControl mb={5}>
                <FormHelperText fontSize='xs' id='name-helper-text' mb={1}>
                  Channel ID
                </FormHelperText>
                <Input
                  name='channelId'
                  placeholder='740322309713428666'
                  w='60%'
                  ref={register({ required: true })}
                />
              </FormControl>
            </Box>
            {!isConnected ? (
              <>
                <Text mb={2} color='red.500'>
                  {connectionError}
                </Text>
                <Button disabled={loading} onClick={testConnection}>
                  Test Connection
                </Button>
              </>
            ) : (
              <>
                <Text mb={2}>Success!</Text>
                <Button type='submit' isLoading={loading}>
                  Launch Notifications
                </Button>
              </>
            )}
          </form>
        </>
      ) : null}

      {step === 'success' ? (
        <>
          {loading ? (
            <Spinner />
          ) : (
            <>
              <Heading as='h4' size='md' fontWeight='100'>
                Notification Level 1 Added
              </Heading>
              <Text my={6}>
                We have turned on a couple notifications for you. You can edit
                these later in Settings > Notifications.
              </Text>

              <Button
                as={RouterLink}
                to={`/dao/${dao.address}/settings/notifications`}
              >
                Manage Settings
              </Button>
            </>
          )}
        </>
      ) : null}
    </>
  );
};

export default NotificationsLaunch;
