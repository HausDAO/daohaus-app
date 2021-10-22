import React, { useEffect } from 'react';
import { Select } from '@chakra-ui/select';

import GenericInput from './genericInput';

const InputSelect = props => {
  const {
    options,
    selectName,
    localForm,
    selectChange,
    selectPlaceholder,
    selectOptions,
    disabled,
  } = props;

  const { register, watch, setValue } = localForm;
  const selectVal = watch(selectName);

  useEffect(() => {
    if (options?.length && !selectVal && !selectPlaceholder) {
      const val = options[0]?.value || '';
      setValue(selectName, val);
    }
  }, [options, selectVal]);

  const handleSelectChange = e => {
    selectChange?.(e);
  };

  if (!options?.length) return <GenericInput {...props} />;
  return (
    <GenericInput
      {...props}
      append={
        <Select
          name={selectName || 'select'}
          onChange={handleSelectChange}
          ref={selectOptions ? register(selectOptions) : register}
          disabled={disabled}
          borderTopLeftRadius='0'
          borderBottomLeftRadius='0'
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
