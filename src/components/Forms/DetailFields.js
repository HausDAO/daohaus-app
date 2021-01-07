import React, { useState } from 'react';
import {
  Stack,
  Box,
  Textarea,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  FormHelperText,
} from '@chakra-ui/react';
import TextBox from '../Shared/TextBox';
import { stripHttpProtocol } from '../../utils/helpers';

const DetailsFields = ({ register, presets }) => {
  const [values, setValues] = useState({
    title: presets?.title || '',
    description: presets?.description || '',
    link: presets?.link || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'link') {
      setValues({
        ...values,
        link: stripHttpProtocol(value),
      });
    } else {
      setValues({
        ...values,
        [name]: value,
      });
    }
  };

  return (
    <Stack spacing={2}>
      <Box>
        <TextBox as={FormLabel} size='xs' htmlFor='title' mb={2}>
          Title
        </TextBox>
        <Input
          name='title'
          placeholder='Proposal Title'
          mb={2}
          ref={register({
            required: {
              value: true,
              message: 'Title is required',
            },
          })}
          onChange={handleChange}
          value={values.title}
          color='white'
          focusBorderColor='secondary.500'
        />
      </Box>
      <Box>
        <TextBox as={FormLabel} size='xs' htmlFor='description' mb={2}>
          Description
        </TextBox>
        <Textarea
          name='description'
          placeholder='Short Description'
          type='textarea'
          mb={0}
          h={10}
          ref={register()}
          onChange={handleChange}
          value={values.description}
          color='white'
          focusBorderColor='secondary.500'
        />
      </Box>
      <Box>
        <TextBox as={FormLabel} size='xs' htmlFor='link' mb={2}>
          Link
        </TextBox>
        <InputGroup>
          <InputLeftAddon background='primary.600'>https://</InputLeftAddon>
          <Input
            name='link'
            placeholder='daolink.club'
            color='white'
            focusBorderColor='secondary.500'
            onChange={handleChange}
            value={values.link}
            ref={register()}
          />
        </InputGroup>
        <FormHelperText fontSize='sm' color='whiteAlpha.700'>
          We&apos;ll remove the https://
        </FormHelperText>
      </Box>
    </Stack>
  );
};

export default DetailsFields;
