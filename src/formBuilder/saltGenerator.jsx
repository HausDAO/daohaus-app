import React from 'react';
import GenericInput from './genericInput';
import { generateNonce } from '../utils/general';

const SaltGenerator = props => {
  const nonce = generateNonce();
  return <GenericInput {...props} defaultValue={nonce} />;
};

export default SaltGenerator;
