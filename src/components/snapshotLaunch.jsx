import React, { useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Heading,
  Spinner,
  Text,
  Input,
  Stack,
} from '@chakra-ui/react';
import TextBox from './TextBox';
import { getSnapshotSpaces } from '../utils/requests';
import { useOverlay } from '../contexts/OverlayContext';

const SnapshotLaunch = ({ handleLaunch, loading, setLoading, space }) => {
  const { daochain, daoid } = useParams();
  const [snapshotSpace, setSnapshotSpace] = useState(null);
  const [step, setStep] = useState(1);
  const { errorToast } = useOverlay();

  const onSubmit = async () => {
    setLoading(true);
    const snapshotMeta = {
      space: snapshotSpace,
    };
    try {
      const spaces = await getSnapshotSpaces();
      if (Object.keys(spaces).filter(s => s === snapshotSpace)?.length < 1) {
        errorToast({
          title: 'No space found!',
          description:
            'Please verify the space name with the official snapshot name.',
        });
        setLoading(false);
        return false;
      }
    } catch (err) {
      console.log(err);
    }

    const success = await handleLaunch(snapshotMeta);
    if (success) {
      setStep('success');
    }
  };

  const handleChange = event => {
    if (event.target.value) {
      setSnapshotSpace(event.target.value);
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
            Show Snapshot Proposals
          </Heading>
          <Text my={6}>
            View your community&apos;s snapshot proposals directly within
            DAOhaus for easy access.
          </Text>
          <Stack mb={6} spacing={2}>
            <TextBox size=''>Snapshot Space</TextBox>
            <Input
              type='text'
              onChange={e => handleChange(e)}
              defaultValue={space}
            />
            <Text fontSize='xs'>
              No special characters. Dashes and periods allowed.
            </Text>
          </Stack>

          <Button type='submit' disabled={loading} onClick={onSubmit}>
            Lets do it!
          </Button>
        </>
      ) : null}

      {step === 'success' ? (
        <>
          <Heading as='h4' size='md' fontWeight='100'>
            Snapshot powers unlocked!
          </Heading>
          <Text my={6}>
            You can now view your snapshot proposals in DAOhaus
          </Text>
          <Button
            as={RouterLink}
            to={`/dao/${daochain}/${daoid}/boost/snapshot`}
          >
            Go!
          </Button>
        </>
      ) : null}
    </Box>
  );
};

export default SnapshotLaunch;
