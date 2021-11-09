import React from 'react';
import { spreadOptions } from '../utils/formBuilder';
import GenericSelect from './genericSelect';

const convertToBool = val => {
  if (val === 'true') return true;
  if (val === 'false') return false;
  return val;
};

const BoolSelect = props => {
  const { registerOptions } = props;
  const newOptions = spreadOptions({
    registerOptions,
    setValueAs: val => convertToBool(val),
  });
  return (
    <GenericSelect
      {...props}
      options={[
        { name: 'True', value: true },
        { name: 'False', value: false },
      ]}
      registerOptions={newOptions}
    />
  );
};

export default BoolSelect;
