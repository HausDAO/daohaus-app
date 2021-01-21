import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Heading, Text } from '@chakra-ui/react';

import { useDao } from '../../contexts/PokemolContext';

const NotificationsLaunch = ({ handleLaunch, loading, step, setStep }) => {
  const [boostMetadata, setBoostMetadata] = useState({});
  const [dao] = useDao();

  const handleClick = async () => {
    console.log('meta');
    handleLaunch();
  };

  return (
    <Box w='90%'>
      {step === 'intro' ? (
        <>
          <Heading as='h4' size='md' fontWeight='100'>
            Add a Notifications Level 1
          </Heading>
          <Text my={6}>
            Hook up dao action notifications to your Discord server.
          </Text>
          <Button type='submit' disabled={loading} onClick={handleClick}>
            Get Started
          </Button>
        </>
      ) : null}

      {step === 'success' ? (
        <>
          <Heading as='h4' size='md' fontWeight='100'>
            Notification Level 1 Added
          </Heading>
          <Text my={6}>
            We have turned on a couple notifications for you. You can edit these
            later in Settings > Notifications.
          </Text>
          <Button
            as={RouterLink}
            to={`/dao/${dao.address}/settings/notifications`}
          >
            Manage Settings
          </Button>
        </>
      ) : null}
    </Box>
  );
};

export default NotificationsLaunch;
