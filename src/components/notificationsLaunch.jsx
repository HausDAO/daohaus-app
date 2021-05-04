import React, { useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
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

import { notificationBoostContent } from '../content/boost-content';
import { get } from '../utils/requests';

const NotificationsLaunch = ({
  handleLaunch,
  loading,
  setLoading,
  stepOverride,
}) => {
  const { handleSubmit, register, getValues, watch } = useForm();
  const { daoid, daochain } = useParams();
  const [connectionError, setConnectionError] = useState();
  const [isConnected, setIsConnected] = useState();
  const [step, setStep] = useState(stepOverride || 'intro');
  const watchChannel = watch('channelId');

  const onSubmit = async values => {
    setLoading(true);
    const boostMetadata = [
      {
        type: 'discord',
        channelId: values.channelId,
        active: true,
        actions: ['votingPeriod', 'rageQuit', 'newProposal'],
      },
    ];
    const success = await handleLaunch(boostMetadata);
    console.log('success', success);

    if (success) {
      setStep('success');
    }
  };

  const testConnection = async () => {
    setLoading(true);
    const values = getValues();

    const res = await get(`dao/discord-status/${values.channelId}`);
    console.log('res');
    if (res.error || res === []) {
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
            Add Discord Notifications
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
            Discord Notifications - Setup Instructions
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
          {!stepOverride ? (
            <>
              <Heading as='h4' size='md' fontWeight='100'>
                Discord Notifications - Setup Instructions
              </Heading>
              <Text mt={6} fontWeight={700}>
                Step 2
              </Text>
              <Text mb={6}>Get the Discord channel ID</Text>
            </>
          ) : (
            <Heading as='h4' size='md' fontWeight='100'>
              Change the Discord channel ID
            </Heading>
          )}
          <Text mb={3} fontSize='xs'>
            In Discord, open your User Settings &gt; Appearance &gt; Enable
            Developer Mode. Right click on the Discord text channel you want the
            bot to interact with and press “Copy ID”.
          </Text>
          <Text fontSize='xs' mb={3}>
            You need to ensure the new ‘Haus Bot’ role is able to view this
            channel. If the channel is not public for @everyone on the server,
            you will need to add the Haus Bot role into the channel permissions.
          </Text>

          <Text fontSize='xs'>
            Once we verify the channel connection you will be asked to sign a
            message with MetaMask to verify your DAO membership and we will be
            all set!
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
                <Button
                  disabled={loading || !watchChannel}
                  onClick={testConnection}
                >
                  Test Connection
                </Button>
              </>
            ) : (
              <>
                <Text mb={2}>Success!</Text>
                <Button type='submit' isLoading={loading}>
                  {stepOverride
                    ? 'Update Notifications'
                    : 'Launch Notifications'}
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
                Discord Notifications Added
              </Heading>
              <Text my={6}>
                We have turned on a couple notifications for you. You can edit
                these later in Settings &gt; Notifications.
              </Text>

              <Button
                as={RouterLink}
                to={`/dao/${daochain}/${daoid}/settings/notifications`}
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
