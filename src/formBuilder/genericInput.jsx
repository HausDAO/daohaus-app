import React from 'react';
import {
  Input,
  InputLeftAddon,
  InputGroup,
  InputRightAddon,
} from '@chakra-ui/react';

import FieldWrapper from './fieldWrapper';

const GenericInput = ({
  label,
  htmlFor,
  placeholder,
  name,
  localForm,
  helperText,
  btn,
  append,
  info,
  required,
  prepend,
  onChange = null,
  disabled,
  error,
  containerProps,
  w,
}) => {
  const { register } = localForm;

  console.log('w', w);

  return (
    <FieldWrapper
      label={label}
      htmlFor={htmlFor}
      info={info}
      helperText={helperText}
      btn={btn}
      error={error}
      required={required}
      containerProps={containerProps}
      w={w}
    >
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
