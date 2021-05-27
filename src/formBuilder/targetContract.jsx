import React from 'react';
import { validate } from '../utils/validation';
import GenericInput from './genericInput';

const TargetContract = props => {
  const { localForm } = props;

  const selectedMinion = localForm.watch('selectedMinion');
  const isDisabled = !validate.publicKey(selectedMinion);
  const helperText = isDisabled && 'Must select a minion first';

  return (
    <GenericInput {...props} disabled={isDisabled} helperText={helperText} />
  );
};

export default TargetContract;
