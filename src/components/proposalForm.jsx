import React from 'react';
import {
  Box, Flex, FormControl, Input, FormLabel, Textarea, InputLeftAddon, InputGroup,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import TextBox from './TextBox';

const ProposalForm = ({
  fields, tx, onSubmit, onTx,
}) => {
  const localForm = useForm;

  console.log(fields);
  return (
    <form>
      <FormControl
        // isInvalid={errors.name}
        display='flex'
        mb={5}
        height='22rem'

      >
        <Flex w='100%' flexDirection='column' flexWrap='wrap'>
          {fields?.map((field) => {
            return <InputFactory key={field?.htmlFor || field?.name} {...field} localForm={localForm} />;
          })}
        </Flex>
      </FormControl>
    </form>
  );
};

export default ProposalForm;

const InputFactory = (props) => {
  const { type } = props;
  if (type === 'input') {
    return <GenericInput {...props} />;
  }
  if (type === 'textarea') {
    return <GenericTextarea {...props} />;
  }
  if (type === 'linkInput') {
    return <LinkInput {...props} />;
  }
  return null;
};

const GenericInput = ({
  label, htmlFor, placeholder, name, valOnType = [], valOnSubmit = [], localForm,
}) => {
  console.log(label);
  const { register } = localForm();

  return (
    <FieldWrapper>
      <TextBox as={FormLabel} size='xs' htmlFor={htmlFor} mb={2}>
        {label}
      </TextBox>
      <Input
        id={htmlFor}
        name={name}
        placeholder={placeholder || label || htmlFor}
        mb={2}
        ref={register({
          required: {
            value: true,
            message: 'Required',
          },
        })}
      />
    </FieldWrapper>
  );
};

const GenericTextarea = ({
  label, htmlFor, placeholder, name, valOnType = [], valOnSubmit = [], localForm, h = 10,
}) => {
  const { register } = localForm();

  return (
    <FieldWrapper>
      <TextBox as={FormLabel} size='xs' htmlFor={htmlFor} mb={2}>
        {label}
      </TextBox>
      <Textarea
        id={htmlFor}
        name={name}
        placeholder={placeholder || label || htmlFor}
        mb={2}
        h={h}
        ref={register({
          required: {
            value: true,
            message: 'Required',
          },
        })}
      />
    </FieldWrapper>);
};

const LinkInput = ({
  label, htmlFor, placeholder, name, valOnType = [], valOnSubmit = [], localForm, h = 10,
}) => {
  return (
    <FieldWrapper>
      <TextBox as={FormLabel} size='xs' htmlFor={htmlFor} mb={2}>
        {label}
      </TextBox>
      <InputGroup>
        <InputLeftAddon background='primary.600'>https://</InputLeftAddon>
        <Input
          id={htmlFor}
          name={name}
          placeholder={placeholder || label || htmlFor}
          mb={2}
        />
      </InputGroup>
    </FieldWrapper>
  );
};
const FieldWrapper = ({ children }) => {
  return <Box w={['100%', null, '50%']} mb={5}>{children}</Box>;
};
