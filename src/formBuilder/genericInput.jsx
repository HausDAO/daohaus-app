import React from 'react';
import {
  Input,
  InputLeftAddon,
  InputGroup,
  InputRightAddon,
} from '@chakra-ui/react';

import FieldWrapper from './fieldWrapper';

const GenericInput = props => {
  const {
    label,
    htmlFor,
    placeholder,
    name,
    localForm,
    append,
    prepend,
    onChange = null,
    disabled,
    defaultValue,
    registerOptions,
    formState,
  } = props;
  const { register } = localForm;

  return (
    <FieldWrapper {...props}>
      <InputGroup>
        {prepend && (
          <InputLeftAddon background='primary.600' borderColor='inherit'>
            {prepend}
          </InputLeftAddon>
        )}
        <Input
          key={name}
          id={htmlFor}
          name={name}
          onChange={onChange}
          placeholder={placeholder || label || htmlFor}
          ref={register(registerOptions)}
          disabled={disabled || formState === 'loading'}
          defaultValue={defaultValue}
        />
        {append && (
          <InputRightAddon
            background='primary.600'
            p={typeof append === 'string' ? 4 : 0}
            borderColor='inherit'
          >
            {append}
          </InputRightAddon>
        )}
      </InputGroup>
    </FieldWrapper>
  );
};

export default GenericInput;
