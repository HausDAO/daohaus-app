import React from 'react';
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

const DetailsFields = ({ register }) => (
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
          ref={register({
            setValueAs: value => {
              return stripHttpProtocol(value);
            },
          })}
        />
      </InputGroup>
      <FormHelperText fontSize='xs' color='whiteAlpha.700'>
        Try a .gif or .png! We&apos;ll remove the https:// on submit
      </FormHelperText>
    </Box>
  </Stack>
);

export default DetailsFields;
