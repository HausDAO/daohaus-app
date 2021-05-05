import React, { useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Button, Flex, Heading, Spinner, Text } from '@chakra-ui/react';
import { SketchPicker } from 'react-color';

import { useMetaData } from '../contexts/MetaDataContext';
import { useCustomTheme } from '../contexts/CustomThemeContext';
import TextBox from './TextBox';

const DiscourseLaunch = ({ handleLaunch, loading, setLoading }) => {
  const { daoMetaData } = useMetaData();
  const { daoid, daochain } = useParams();
  const { theme } = useCustomTheme();
  const [pickerOpen, setPickerOpen] = useState(null);
  const [step, setStep] = useState('intro');
  const [colors, setColors] = useState({
    color: theme.colors.primary[500],
  });

  console.log('theme', theme);

  const onSubmit = async () => {
    setLoading(true);
    const boostMetadata = {
      name: daoMetaData.name,
      color: colors.color.replace('#', ''),
      autoProposal: true,
    };
    const success = await handleLaunch(boostMetadata);
    if (success) {
      setStep('success');
    }
  };

  const handleChange = (color, item) => {
    setColors(prevState => {
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
                    onChangeComplete={color => handleChange(color, 'color')}
                    disableAlpha
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
                You can find a link to your forum and manage the boost in the
                Discourse settings page.
              </Text>

              <Button
                as={RouterLink}
                to={`/dao/${daochain}/${daoid}/settings/discourse`}
              >
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
