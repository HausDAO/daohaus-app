import React, { useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  Heading,
  Input,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { SketchPicker } from 'react-color';
import { useForm } from 'react-hook-form';

import { useMetaData } from '../contexts/MetaDataContext';
import TextBox from './TextBox';

const DiscourseLaunch = ({ handleLaunch, loading, setLoading }) => {
  const { daoMetaData } = useMetaData();
  const { daoid, daochain } = useParams();
  const [pickerOpen, setPickerOpen] = useState(null);
  const [step, setStep] = useState('intro');
  const [colors, setColors] = useState({
    color: '#000000',
    textColor: '#ffffff',
  });

  const onSubmit = async () => {
    setLoading(true);
    const boostMetadata = {
      name: daoMetaData.name,
      color: colors.color.replace('#', ''),
      textColor: colors.textColor.replace('#', ''),
    };
    const success = await handleLaunch(boostMetadata);
    if (success) {
      setStep('success');
    }
  };

  const handleChange = (color, item) => {
    setColors((prevState) => {
      return {
        ...prevState,
        [item]: color.hex,
      };
    });
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

          <Flex justify='flex-start' align='center' mb={10}>
            <TextBox size='sm'>Forum Color</TextBox>
            <Box>
              <Box
                w='35px'
                h='35px'
                borderRadius='25px'
                border='1px solid white'
                bg={colors.color}
                ml={5}
                onClick={() => setPickerOpen('color')}
                _hover={{ cursor: 'pointer' }}
              />
              {pickerOpen === 'color' ? (
                <Box position='absolute' zIndex={5}>
                  <Box
                    position='fixed'
                    top='0px'
                    right='0px'
                    bottom='0px'
                    left='0px'
                    onClick={() => setPickerOpen(null)}
                  />
                  <SketchPicker
                    color={colors.color}
                    onChangeComplete={(color) => handleChange(color, 'color')}
                    disableAlpha={true}
                  />
                </Box>
              ) : null}
            </Box>
          </Flex>

          <Button disabled={loading} onClick={onSubmit}>
            Launch
          </Button>
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

              <Button as={RouterLink} to={`/dao/${daochain}/${daoid}/settings`}>
                Settings
              </Button>
            </>
          )}
        </>
      ) : null}
    </>
  );
};

export default DiscourseLaunch;
