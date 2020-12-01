import {
  Stack,
  Box,
  Textarea,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
} from '@chakra-ui/react';
import TextBox from '../Shared/TextBox';
import React from 'react';

const DetailsFields = ({ register }) => {
  return (
    <Stack spacing={2}>
      <Box>
        <TextBox as={FormLabel} htmlFor='title' mb={2}>
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
          color='white'
          focusBorderColor='secondary.500'
        />
      </Box>
      <Box>
        <TextBox as={FormLabel} htmlFor='description' mb={2}>
          Description
        </TextBox>
        <Textarea
          name='description'
          placeholder='Short Description'
          type='textarea'
          mb={0}
          h={10}
          ref={register({
            required: {
              value: true,
              message: 'Description is required',
            },
          })}
          color='white'
          focusBorderColor='secondary.500'
        />
      </Box>
      <Box>
        <TextBox as={FormLabel} htmlFor='link' mb={2}>
          Link
        </TextBox>
        <InputGroup>
          <InputLeftAddon background='primary.600'>https://</InputLeftAddon>
          <Input
            name='link'
            placeholder='daolink.club'
            color='white'
            focusBorderColor='secondary.500'
            ref={register({
              required: {
                value: true,
                message: 'Reference Link is required',
              },
            })}
          />
        </InputGroup>
      </Box>
    </Stack>
  );
};

export default DetailsFields;
