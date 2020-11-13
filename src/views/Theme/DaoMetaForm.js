import React from 'react';
import {
  Button,
  Flex,
  Box,
  ButtonGroup,
  Input,
  InputGroup,
  InputLeftAddon,
} from '@chakra-ui/core';
import { useForm } from 'react-hook-form';
import raidBg from '../../assets/themes/raidTheme/raid__fantasy--bg.jpg';
import raidBrand from '../../assets/themes/raidTheme/raidguild__swords.svg';

import { useTheme } from '../../contexts/CustomThemeContext';

const daoMetaFormFields = [
  {
    name: 'proposals',
    label: 'Proposals',
  },
  {
    name: 'proposal',
    label: 'Proposal',
  },
  {
    name: 'members',
    label: 'Members',
  },
  {
    name: 'member',
    label: 'Member',
  },
  {
    name: 'bank',
    label: 'Bank',
  },
  {
    name: 'boosts',
    label: 'Boosts',
  },
  {
    name: 'boost',
    label: 'Boost',
  },
  {
    name: 'f04title',
    label: '404 Title',
  },
  {
    name: 'f04heading',
    label: '404 Heading',
  },
  {
    name: 'f04subhead',
    label: '404 Subheading',
  },
  {
    name: 'f04cta',
    label: '404 Button CTA',
  },
];

const DaoMetaForm = () => {
  const [theme, setTheme] = useTheme();
  const { register, handleSubmit } = useForm();

  const onSubmit = (values) => {
    console.log(values);
    setTheme({
      primary500: '#e50651',
      secondary500: '#6153ff',
      bg500: '#121212',
      brandImg: raidBrand,
      bgImg: raidBg,
      bgOverlayOpacity: '0.5',
      primaryFont: 'Space Mono', // only temporary
      bodyFont: 'Rubik',
      daoMeta: {
        proposals: values.proposals || 'Proposals',
        proposal: values.proposals || 'Proposal',
        bank: values.bank || 'Bank',
        members: values.members || 'Members',
        member: values.member || 'Member',
        boosts: values.boosts || 'Apps',
        boost: values.boost || 'App',
        discord: 'https://discord.gg/WqwQGgeeFd',
        medium: '',
        telegram: '',
        website: '',
        other: '',
        f04title: '404 You are lost',
        f04heading: 'GPS Signal Lost',
        f04subhead:
          'Please flag down your nearest carrier pigeon to send a message.',
        f04cta: 'Reload',
      },
    });
  };

  return (
    <>
      <Box fontSize='xl' fontFamily='heading'>
        DAO Meta
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex direction='column'>
          {daoMetaFormFields.map((field) => {
            return (
              <InputGroup
                m={1}
                display='flex'
                justifyContent='center'
                key={field.name}
              >
                <InputLeftAddon bg='secondary.700' w='40%'>
                  {field.label}
                </InputLeftAddon>
                <Input
                  name='proposal'
                  defaultValue={theme.daoMeta[field.name]}
                  ref={register({ required: true })}
                  w='45%'
                />
              </InputGroup>
            );
          })}
        </Flex>

        <Flex justify='center' pt={4}>
          <ButtonGroup>
            <Button type='submit'>Set metadata</Button>
          </ButtonGroup>
        </Flex>
      </form>
    </>
  );
};

export default DaoMetaForm;
