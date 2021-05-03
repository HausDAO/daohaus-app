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

import { RiAddFill } from 'react-icons/ri';
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

const ProposalForm = ({
  fields, tx, onSubmit, onTx, additionalOptions,
}) => {
  const [loading, setLoading] = useState(false);
  // const { newDaoProposal } = useTX();
  const localForm = useForm;

  return (
    <form>
      <Flex flexDir='column'>
        <FormControl
        // isInvalid={errors.name}
          display='flex'
          mb={5}

        >
          <Flex w='100%' flexWrap='wrap' justifyContent='space-between'>
            {fields?.map((field) => {
              return <InputFactory key={field?.htmlFor || field?.name} {...field} localForm={localForm} />;
            })}
          </Flex>
        </FormControl>
        <FormFooter additionalOptions={additionalOptions} />
      </Flex>
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
  if (type === 'inputSelect') {
    return <InputSelect {...props} />;
  }
  return null;
};

const GenericInput = ({
  label, htmlFor, placeholder, name, valOnType = [], valOnSubmit = [], localForm, append, prepend,
}) => {
  console.log(label);
  const { register } = localForm();

  return (
    <FieldWrapper>
      <TextBox as={FormLabel} size='xs' htmlFor={htmlFor}>
        {label}
      </TextBox>
      <InputGroup>
        {prepend && <InputLeftAddon background='primary.600'>{prepend}</InputLeftAddon>}
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
        {append && <InputRightAddon background='primary.600' p={0}>{append}</InputRightAddon>}
      </InputGroup>
    </FieldWrapper>
  );
};

const InputSelect = (props) => {
  const { options } = props;

  return (
    <GenericInput
      {...props}
      append={
        <Select>
          {options?.map((option, index) => (
            <option
              key={`${option?.value}-${index}`}
              value={option.value}
            >
              {option.name}
            </option>))}
        </Select>
        }
    />

  );
};

const GenericTextarea = ({
  label, htmlFor, placeholder, name, valOnType = [], valOnSubmit = [], localForm, h = 10,
}) => {
  const { register } = localForm();

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
    </FieldWrapper>);
};

const LinkInput = (props) => {
  return (
    <GenericInput {...props} prepend='https://' />
  );
};
const FieldWrapper = ({ children }) => {
  return <Box w={['100%', null, '48%']} mb={2}>{children}</Box>;
};

const AdditionalOptions = ({ options }) => {
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
          <MenuItem>
            Applicant
          </MenuItem>
          <MenuItem>
            Request Loot
          </MenuItem>
          <MenuItem>
            Request Payment
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};

const FormFooter = ({ additionalOptions, loading }) => {
  if (additionalOptions?.length) {
    return (
      <Flex justifyContent='flex-end'>
        <AdditionalOptions mr='auto' />
        <Button
          // type='submit'
          loadingText='Submitting'
          isLoading={loading}
          disabled={loading}
          borderBottomLeftRadius='0'
          borderTopLeftRadius='0'
        >
          Submit
        </Button>
      </Flex>
    );
  }
  return (
    <Button
      type='submit'
      loadingText='Submitting'
      isLoading={loading}
      disabled={loading}
    >
      Submit
    </Button>
  );
};
