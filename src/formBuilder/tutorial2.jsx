import React from 'react';

import GenericInput from './genericInput';
import { spreadOptions } from '../utils/formBuilder';
import { getContractBalance } from '../utils/tokenValue';

const Tutorial2 = props => {
  const { registerOptions, decimals, listenTo, localForm } = props;
  const { watch } = localForm;
  const externalDecimals = listenTo && watch(listenTo);

  const inputOptions = spreadOptions({
    registerOptions,
    setValueAs: val => getContractBalance(val, externalDecimals || decimals),
  });
  return <GenericInput {...props} registerOptions={inputOptions} />;
};

export default Tutorial2;
