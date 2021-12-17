import React, { useEffect } from 'react';
import GenericInput from './genericInput';

const PrecomputedInput = props => {
  const SEPARATOR = /<\d+>/g;
  const { fields, localForm, name, strPattern } = props;
  const { setValue } = localForm;
  const formValues = localForm.getValues();
  const watchers = fields.map(f => localForm.watch(f));

  useEffect(() => {
    const values = Object.fromEntries(
      fields.map((f, i) => [`<${i}>`, formValues[f]]),
    );
    const value = strPattern.replace(SEPARATOR, k => values[k]);
    setValue(name, value);
  }, watchers);

  return <GenericInput {...props} />;
};

export default PrecomputedInput;
