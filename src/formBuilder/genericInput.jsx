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
  } = props;
  const { register } = localForm;
  return (
    <FieldWrapper {...props}>
      <InputGroup>
        {prepend && (
          <InputLeftAddon background='primary.600'>{prepend}</InputLeftAddon>
        )}
        <Input
          id={htmlFor}
          name={name}
          onChange={onChange}
          placeholder={placeholder || label || htmlFor}
          ref={register}
          disabled={disabled}
          defaultValue={
            defaultValue &&
            (typeof defaultValue === 'function' ? defaultValue() : defaultValue)
          }
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

export default GenericInput;
