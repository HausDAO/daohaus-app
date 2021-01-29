import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Heading,
  Input,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { useDao } from '../../contexts/PokemolContext';

const DiscourseLaunch = ({ handleLaunch, loading, setLoading }) => {
  const [dao] = useDao();
  const { handleSubmit, register } = useForm({
    defaultValues: { color: '000000', textColor: 'ffffff' },
  });
  const [step, setStep] = useState('intro');

  const onSubmit = async (values) => {
    const boostMetadata = {
      name: dao.name,
      color: values.color,
      textColor: values.textColor,
    };
    handleLaunch(boostMetadata);
    setStep('success');
  };

  return (
    <>
      {step === 'intro' ? (
        <>
          <Heading as='h4' size='md' fontWeight='100'>
            Add Discoure Forum
          </Heading>
          <Text my={6}>
            Launch a new category in the DAOhaus Discourse forum and enable
            topic creation for all of your proposals.
          </Text>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box mt={6}>
              <FormControl mb={5}>
                <FormHelperText fontSize='xs' id='name-helper-text' mb={1}>
                  Color
                </FormHelperText>
                <Input
                  name='color'
                  w='60%'
                  ref={register({ required: true })}
                />
              </FormControl>
              <FormControl mb={5}>
                <FormHelperText fontSize='xs' id='name-helper-text' mb={1}>
                  Text Color
                </FormHelperText>
                <Input
                  name='textColor'
                  w='60%'
                  ref={register({ required: true })}
                />
              </FormControl>
            </Box>

            <>
              <Button type='submit' disabled={loading}>
                Launch
              </Button>
            </>
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
                Discourse Forum Added
              </Heading>
              <Text my={6}>
                There will be a link to this forum in your setting page. You
                will also see buttons in proposal pages and forms to add new
                forum topics for your proposals.
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

export default DiscourseLaunch;
