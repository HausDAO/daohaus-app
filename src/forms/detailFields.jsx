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
import TextBox from '../components/TextBox';
import { stripHttpProtocol } from '../utils/general';

const DetailsFields = ({ register, defaultTitle }) => {
  const [values, setValues] = useState({
    title: defaultTitle || '',
    description: '',
    link: '',
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
        />
      </Box>
      <Box>
        <TextBox as={FormLabel} size='xs' htmlFor='description' mb={2}>
          Description
        </TextBox>
        <Textarea
          placeholder='Short Description'
          mb={0}
          h={10}
          ref={register}
          name='description'
          onChange={handleChange}
          value={values.description}
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
            onChange={handleChange}
            value={values.link}
            ref={register}
          />
        </InputGroup>
        <FormHelperText fontSize='sm' color='whiteAlpha.700'>
          Try a gif or png! We&apos;ll remove the https://
        </FormHelperText>
      </Box>
    </Stack>
  );
};

export default DetailsFields;
