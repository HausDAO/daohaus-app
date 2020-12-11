import React, { useState } from 'react';
import {
  Button,
  Flex,
  Stack,
  ButtonGroup,
  Box,
  Select,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { SketchPicker } from 'react-color';
import { useTheme } from '../../contexts/CustomThemeContext';
import ContentBox from '../../components/Shared/ContentBox';
import TextBox from '../../components/Shared/TextBox';

const ThemeColorsForm = ({ handleThemeUpdate, resetTheme }) => {
  const [theme] = useTheme();
  const { handleSubmit } = useForm();
  const [values, setValues] = useState({
    primary500: theme.colors.primary[500],
    secondary500: theme.colors.secondary[500],
    background500: theme.colors.background[500],
  });
  const [pickerOpen, setPickerOpen] = useState(null);

  const onSubmit = (values) => {
    handleThemeUpdate(values);
  };
  console.log(values);

  const handleChange = (color, item) => {
    setValues({
      ...values,
      [item]: color.hex,
    });
    setPickerOpen(null);
  };

  return (
    <>
      <ContentBox as='form' onSubmit={handleSubmit(onSubmit)} m={6}>
        <Stack spacing={4} pr='5%'>
          <Flex justify='space-between' align='center'>
            <TextBox>Primary Color</TextBox>
            <Box
              w='35px'
              h='35px'
              borderRadius='25px'
              border={`1px solid ${theme.colors.whiteAlpha[800]}`}
              bg={values.primary500}
              onClick={() => setPickerOpen('primary')}
              _hover={{ cursor: 'pointer' }}
            >
              {pickerOpen === 'primary' ? (
                <Box position='absolute' zIndex={2}>
                  <Box
                    position='fixed'
                    top='0px'
                    right='0px'
                    bottom='0px'
                    left='0px'
                    onClick={() => setPickerOpen(null)}
                  />
                  <SketchPicker
                    color={values.primary500}
                    onChange={(color) => handleChange(color, 'primary500')}
                  />
                </Box>
              ) : null}
            </Box>
          </Flex>

          <Flex justify='space-between' align='center'>
            <TextBox>Secondary Color</TextBox>
            <Box
              w='35px'
              h='35px'
              borderRadius='25px'
              border={`1px solid ${theme.colors.whiteAlpha[800]}`}
              bg={values.secondary500}
              onClick={() => setPickerOpen('secondary')}
              _hover={{ cursor: 'pointer' }}
            >
              {pickerOpen === 'secondary' ? (
                <Box position='absolute' zIndex={2}>
                  <Box
                    position='fixed'
                    top='0px'
                    right='0px'
                    bottom='0px'
                    left='0px'
                    onClick={() => setPickerOpen(null)}
                  />
                  <SketchPicker
                    color={values.secondary500}
                    onChange={(color) => handleChange(color, 'secondary500')}
                  />
                </Box>
              ) : null}
            </Box>
          </Flex>

          <Flex justify='space-between' align='center'>
            <TextBox>Background Color</TextBox>
            <Box
              w='35px'
              h='35px'
              borderRadius='25px'
              border={`1px solid ${theme.colors.whiteAlpha[800]}`}
              bg={values.background500}
              onClick={() => setPickerOpen('background')}
              _hover={{ cursor: 'pointer' }}
            >
              {pickerOpen === 'background' ? (
                <Box position='absolute' zIndex={2}>
                  <Box
                    position='fixed'
                    top='0px'
                    right='0px'
                    bottom='0px'
                    left='0px'
                    onClick={() => setPickerOpen(null)}
                  />
                  <SketchPicker
                    color={values.background500}
                    onChange={(color) => handleChange(color, 'background500')}
                  />
                </Box>
              ) : null}
            </Box>
          </Flex>
          <Select placeholder='Primary Font'>
            <option>Font 1</option>
            <option>Font 2</option>
            <option>Font 3</option>
          </Select>

          <Select placeholder='Data Font'>
            <option>Font 1</option>
            <option>Font 2</option>
            <option>Font 3</option>
          </Select>
        </Stack>

        <Flex justify='center' pt={7}>
          <ButtonGroup>
            <Button type='submit'>Set Theme</Button>
            <Button onClick={resetTheme} mb={3} variant='outline'>
              Reset Theme
            </Button>
          </ButtonGroup>
        </Flex>
      </ContentBox>
    </>
  );
};

export default ThemeColorsForm;
