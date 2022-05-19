import React from 'react';
import { Select } from '@chakra-ui/react';

import FieldWrapper from './fieldWrapper';

const GenericSelect = props => {
  const {
    htmlFor,
    placeholder,
    name,
    localForm,
    options = [],
    disabled,
    onChange,
    containerProps,
    mb,
    registerOptions,
    formState,
    listLoading,
  } = props;
  const { register } = localForm || {};
  return (
    <FieldWrapper {...props} containerProps={containerProps} mb={mb}>
      <Select
        key={name}
        placeholder={placeholder}
        id={htmlFor}
        name={name}
        disabled={disabled || formState === 'loading' || listLoading}
        onChange={onChange}
        ref={register(registerOptions)}
      >
        {options?.map(option => (
          <option value={option.value} key={option.key || option.value}>
            {option.name}
          </option>
        ))}
      </Select>
    </FieldWrapper>
  );
};

export default GenericSelect;
