import React from 'react';
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  ButtonGroup,
} from '@chakra-ui/core';
import { useForm } from 'react-hook-form';
import { useTheme } from '../../contexts/CustomThemeContext';

const ThemeColorsForm = ({ handleThemeUpdate, resetTheme }) => {
  const [theme] = useTheme();
  const { register, handleSubmit } = useForm();

  const onSubmit = (values) => {
    handleThemeUpdate(values);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex direction='column'>
          <InputGroup m={3} display='flex' justifyContent='center'>
            <InputLeftAddon bg='primary.500' w='40%'>
              primary.500
            </InputLeftAddon>
            <Input
              name='primary500'
              defaultValue={theme.colors.primary[500]}
              ref={register({ required: true })}
              w='45%'
            />
          </InputGroup>
          <InputGroup m={3} display='flex' justifyContent='center'>
            <InputLeftAddon bg='secondary.500' w='40%'>
              secondary.500
            </InputLeftAddon>
            <Input
              name='secondary500'
              defaultValue={theme.colors.secondary[500]}
              ref={register({ required: true })}
              w='45%'
            />
          </InputGroup>
          <InputGroup m={3} display='flex' justifyContent='center'>
            <InputLeftAddon bg='background.500' w='40%'>
              background.500
            </InputLeftAddon>
            <Input
              name='bg500'
              defaultValue={theme.colors.background[500]}
              ref={register({ required: true })}
              w='45%'
            />
          </InputGroup>
        </Flex>

        <Flex justify='center'>
          <ButtonGroup>
            <Button type='submit'>Set Theme</Button>
            <Button onClick={resetTheme} mb={3} variant='outline'>
              Reset Theme
            </Button>
          </ButtonGroup>
        </Flex>
      </form>
    </>
  );
};

export default ThemeColorsForm;
