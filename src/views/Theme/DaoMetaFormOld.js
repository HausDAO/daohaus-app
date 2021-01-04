import React from 'react';
import {
  Button,
  Flex,
  Box,
  ButtonGroup,
  Input,
  InputGroup,
  InputLeftAddon,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

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

const DaoMetaFormOld = ({ handleThemeUpdate }) => {
  const { register, handleSubmit } = useForm();
  const [theme] = useTheme();

  const onSubmit = (values) => {
    handleThemeUpdate(values);
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
                  name={theme.daoMeta[field.name]}
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

export default DaoMetaFormOld;
