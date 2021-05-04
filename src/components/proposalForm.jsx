import React, { useState } from 'react';
import {
  Button,
  Box,
  Flex,
  FormControl,
  Input,
  FormLabel,
  Textarea,
  Menu,
  InputLeftAddon,
  InputGroup,
  InputRightAddon,
  Select,
  MenuButton,
  Icon,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { RiAddFill, RiErrorWarningLine } from 'react-icons/ri';
import TextBox from './TextBox';

// const getHeight = (fields) => {
//   if (!fields.length > 0) {
//     throw new Error('Proposal form has zero fields, please input data into the component correctly');
//   }
//   if (fields.length > 8) {
//     return '28rem';
//   }
//   if (fields.length > 6) {
//     return '24rem';
//   }
//   if (fields.legth > 4) {
//     return '22rem';
//   }
//   if (fields.length > 0) {
//     return '18rem';
//   }
// };

const ProposalForm = ({ fields, tx, onTx, additionalOptions = null }) => {
  const [loading, setLoading] = useState(false);
  const [formFields, setFields] = useState(fields);
  const [options, setOptions] = useState(additionalOptions);
  // const { newDaoProposal } = useTX();
  const localForm = useForm();
  const { handleSubmit } = localForm;

  const addOption = e => {
    const selectedOption = options.find(
      option => option.htmlFor === e.target.value,
    );
    setOptions(options.filter(option => option.htmlFor !== e.target.value));
    setFields([...formFields, selectedOption]);
  };
  const onSubmit = values => {
    console.log('values', values);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex flexDir='column'>
        <FormControl
          // isInvalid={errors.name}
          display='flex'
          mb={5}
        >
          <Flex w='100%' flexWrap='wrap' justifyContent='space-between'>
            {formFields?.map(field => {
              return (
                <InputFactory
                  key={field?.htmlFor || field?.name}
                  {...field}
                  localForm={localForm}
                />
              );
            })}
          </Flex>
        </FormControl>
        <FormFooter options={options} addOption={addOption} />
      </Flex>
    </form>
  );
};

export default ProposalForm;

const InputFactory = props => {
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
  if (type === 'inputSelect') {
    return <InputSelect {...props} />;
  }
  return null;
};

const GenericInput = ({
  label,
  htmlFor,
  placeholder,
  name,
  valOnType = [],
  valOnSubmit = [],
  localForm,
  append,
  prepend,
}) => {
  const { register } = localForm;

  return (
    <FieldWrapper>
      <TextBox as={FormLabel} size='xs' htmlFor={htmlFor}>
        {label}
      </TextBox>
      <InputGroup>
        {prepend && (
          <InputLeftAddon background='primary.600'>{prepend}</InputLeftAddon>
        )}
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
        {append && (
          <InputRightAddon background='primary.600' p={0}>
            {append}
          </InputRightAddon>
        )}
      </InputGroup>
    </FieldWrapper>
  );
};

const InputSelect = props => {
  const { options } = props;

  return (
    <GenericInput
      {...props}
      append={
        <Select>
          {options?.map((option, index) => (
            <option key={`${option?.value}-${index}`} value={option.value}>
              {option.name}
            </option>
          ))}
        </Select>
      }
    />
  );
};

const GenericTextarea = ({
  label,
  htmlFor,
  placeholder,
  name,
  valOnType = [],
  valOnSubmit = [],
  localForm,
  h = 10,
}) => {
  const { register } = localForm;

  return (
    <FieldWrapper>
      <TextBox as={FormLabel} size='xs' htmlFor={htmlFor}>
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
    </FieldWrapper>
  );
};

const LinkInput = props => {
  return <GenericInput {...props} prepend='https://' />;
};

const FieldWrapper = ({ children }) => {
  return (
    <Box w={['100%', null, '48%']} mb={2}>
      {children}
    </Box>
  );
};

const AdditionalOptions = ({ options = [], addOption }) => {
  return (
    <Box>
      <Menu color='white' textTransform='uppercase'>
        <MenuButton
          as={Button}
          variant='outline'
          rightIcon={<Icon as={RiAddFill} />}
          borderTopRightRadius='0'
          borderBottomRightRadius='0'
          type='button'
        >
          Additional Options
        </MenuButton>
        <MenuList>
          {options.map(option => {
            return (
              <MenuItem
                key={option.htmlFor}
                onClick={addOption}
                value={option.htmlFor}
              >
                {option.label}
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    </Box>
  );
};

const FormFooter = ({ options, loading, addOption }) => {
  if (options?.length) {
    return (
      <Box>
        <Flex alignItems='flex-end' flexDir='column'>
          <Flex mb={2}>
            <AdditionalOptions
              mr='auto'
              options={options}
              addOption={addOption}
            />
            <Button
              type='submit'
              loadingText='Submitting'
              isLoading={loading}
              disabled={loading}
              borderBottomLeftRadius='0'
              borderTopLeftRadius='0'
            >
              Submit
            </Button>
          </Flex>
          <Flex flexDirection='column' alignItems='flex-start'>
            <SubmitFormError message='Must be 8-12 characters' />
          </Flex>
        </Flex>
      </Box>
    );
  }
  return (
    <Flex justifyContent='flex-end'>
      <Button
        type='submit'
        loadingText='Submitting'
        isLoading={loading}
        disabled={loading}
      >
        Submit
      </Button>
    </Flex>
  );
};

const SubmitFormError = ({ message }) => {
  return (
    <Flex color='secondary.300' fontSize='m' alignItems='flex-start'>
      <Icon
        as={RiErrorWarningLine}
        color='secondary.300'
        mr={2}
        transform='translateY(2px)'
      />
      {message}
    </Flex>
  );
};
