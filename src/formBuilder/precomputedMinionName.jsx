import React, { useEffect } from 'react';
import GenericInput from './genericInput';
import { getMinionSafeNameByPattern } from '../utils/minionUtils';

const PrecomputedMinionName = props => {
  const { boostId, values } = props;
  const { minionType } = values;
  const FIELDS = ['_minionName', 'foreignChainId', 'foreignSafeAddress'];
  const { localForm, name } = props;
  const { setValue } = localForm;
  const formValues = localForm.getValues();
  const watchers = FIELDS.map(f => localForm.watch(f));

  useEffect(() => {
    const values = Object.fromEntries(
      FIELDS.map((f, i) => [`<${i}>`, formValues[f]]),
    );
    const value = getMinionSafeNameByPattern({ boostId, minionType, values });
    setValue(name, value);
  }, watchers);

  return <GenericInput {...props} />;
};

export default PrecomputedMinionName;
