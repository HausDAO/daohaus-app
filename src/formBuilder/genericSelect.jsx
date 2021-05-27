import React from 'react';
import { Select } from '@chakra-ui/react';

import FieldWrapper from './fieldWrapper';

const GenericSelect = ({
  label,
  htmlFor,
  placeholder,
  name,
  localForm,
  helperText,
  btn,
  info,
  options = [],
  error,
  disabled,
}) => {
  const { register } = localForm;
  return (
    <FieldWrapper
      label={label}
      htmlFor={htmlFor}
      info={info}
      helperText={helperText}
      btn={btn}
      error={error}
    >
      <Select
        placeholder={placeholder}
        ref={register}
        id={htmlFor}
        name={name}
        disabled={disabled}
      >
        {options?.map(option => (
          <option value={option.value} key={option.value}>
            {option.name}
          </option>
        ))}
      </Select>
    </FieldWrapper>
  );
};

export default GenericSelect;
