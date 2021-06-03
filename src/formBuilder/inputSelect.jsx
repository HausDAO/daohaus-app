import React from 'react';
import { Select } from '@chakra-ui/select';

import GenericInput from './genericInput';

const InputSelect = props => {
  const { options, selectName, localForm, selectChange } = props;
  const { register } = localForm;

  const handleSelectChange = e => {
    selectChange?.(e);
  };

  return (
    <GenericInput
      {...props}
      append={
        <Select
          name={selectName || 'select'}
          onChange={handleSelectChange}
          ref={register}
        >
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
export default InputSelect;
