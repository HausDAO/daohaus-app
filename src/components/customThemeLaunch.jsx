import React, { useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Button, Heading, Spinner, Text } from '@chakra-ui/react';

import { defaultTheme } from '../themes/defaultTheme';

const CustomThemeLaunch = ({ handleLaunch, loading, setLoading }) => {
  const { daochain, daoid } = useParams();
  const [step, setStep] = useState(1);

  const onSubmit = async () => {
    setLoading(true);
    const newTheme = defaultTheme;
    delete newTheme.bgImg;
    delete newTheme.avatarImg;

    const success = await handleLaunch(newTheme);
    if (success) {
      setStep('success');
    }
  };

  if (loading) {
    return (
      <Box w='90%'>
        <Spinner />
      </Box>
    );
  }

  return (
    <Box w='90%'>
      {step === 1 ? (
        <>
          <Heading as='h4' size='md' fontWeight='100'>
            Add a Custom Theme
          </Heading>
          <Text my={6}>
            The first upgrade available is a customizable theme for your DAO.
            You can change the look and feel as well the verbage used to fit
            your community&apos;s vibe.
          </Text>

          <Text fontSize='xs' mb={5}>
            You must be a member to add this app, so we wull have you sign a
            message with meta mask and we will be all set!
          </Text>
          <Button type='submit' disabled={loading} onClick={onSubmit}>
            Add Custom Theme
          </Button>
        </>
      ) : null}

      {step === 'success' ? (
        <>
          <Heading as='h4' size='md' fontWeight='100'>
            Custom Theme Added
          </Heading>
          <Text my={6}>
            You can now customize your theme of your DAO! You can edit these
            later in Settings &gt; Custom Theme.
          </Text>
          <Button
            as={RouterLink}
            to={`/dao/${daochain}/${daoid}/settings/theme`}
          >
            Edit Custom Theme
          </Button>
        </>
      ) : null}
    </Box>
  );
};

export default CustomThemeLaunch;
