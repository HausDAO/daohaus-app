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
  } = props;
  const { register } = localForm || {};
  return (
    <FieldWrapper {...props} containerProps={containerProps} mb={mb}>
      <Select
        key={name}
        placeholder={placeholder}
        ref={register}
        id={htmlFor}
        name={name}
        disabled={disabled}
        onChange={onChange}
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
