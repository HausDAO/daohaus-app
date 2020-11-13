import React from 'react';
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  ButtonGroup,
} from '@chakra-ui/core';
import { useForm } from 'react-hook-form';
import { useTheme } from '../../contexts/CustomThemeContext';
import raidBg from '../../assets/themes/raidTheme/raid__fantasy--bg.jpg';
import raidBrand from '../../assets/themes/raidTheme/raidguild__swords.svg';

const ThemeBuilderForm = () => {
  const [theme, setTheme] = useTheme();
  const { register, handleSubmit } = useForm();

  const onSubmit = (values) => {
    setTheme({
      primary500: values.primary500 || '#e50651',
      secondary500: values.secondary500 || '#6153ff',
      bg500: values.bg500 || '#121212',
      brandImg: raidBrand,
      bgImg: raidBg,
      bgOverlayOpacity: '0.5',
      primaryFont: 'Space Mono', // only temporary
      bodyFont: 'Rubik',
      daoMeta: {
        proposals: 'Quests',
        proposal: 'Quest',
        bank: 'Inventory',
        members: 'Players',
        member: 'Player',
        boosts: 'Boosts',
        boost: 'Boost',
        discord: 'https://discord.gg/WqwQGgeeFd',
        medium: '',
        telegram: '',
        website: '',
        other: '',
        f04title: '404 Game Over',
        f04heading: 'You have been slain',
        f04subhead: 'Please reload from the most recent save point.',
        f04cta: 'Start Over',
      },
    });
  };

  const handleReset = () => {
    setTheme();
  };

  return (
    <>
      <Box fontSize='xl' fontFamily='heading'>
        Theme Buidler
      </Box>
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
            <Button onClick={handleReset} mb={3} variant='outline'>
              Reset Theme
            </Button>
          </ButtonGroup>
        </Flex>
      </form>
    </>
  );
};

export default ThemeBuilderForm;
