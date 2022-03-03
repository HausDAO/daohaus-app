import React, { useEffect } from 'react';
import GenericInput from './genericInput';

const PrecomputedMinionName = props => {
  const SEPARATOR = /<\d+>/g;
  const PATTERN = '0xab270234/<0>/<1>/<2>'; // bytes4(keccak256(abi.encodePacked('AMBMinionSafe'))) === 0xab270234
  const FIELDS = ['_minionName', 'foreignChainId', 'foreignSafeAddress'];
  const { localForm, name } = props;
  const { setValue } = localForm;
  const formValues = localForm.getValues();
  const watchers = FIELDS.map(f => localForm.watch(f));

  useEffect(() => {
    const values = Object.fromEntries(
      FIELDS.map((f, i) => [`<${i}>`, formValues[f]]),
    );
    const value = PATTERN.replace(SEPARATOR, k => values[k]);
    setValue(name, value);
  }, watchers);

  return <GenericInput {...props} />;
};

export default PrecomputedMinionName;
