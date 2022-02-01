import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import GenericSwitch from './genericSwitch';
import { supportedChains } from '../utils/chain';
import { useFormConditions } from '../utils/formBuilder';

const ToggleToken = props => {
  const { daochain } = useParams();
  const {
    formCondition,
    checked,
    unchecked,
    setFormCondition,
    label,
    title,
    description,
  } = props;
  const [checkLabel, checkTitle, checkDescription] = useFormConditions({
    values: [label, title, description],
    condition: formCondition,
  });

  const findStartingState = props => {
    if (!props) return;
    const { checked, formCondition } = props;
    return checked === formCondition;
  };

  const tokenLabel = useMemo(
    () =>
      checkLabel === 'Eth' ? supportedChains[daochain].nativeCurrency : 'Token',
    [daochain, checkLabel],
  );
  const isChecked = useMemo(() => findStartingState(props), [props]);

  const handleChange = () =>
    isChecked ? setFormCondition(unchecked) : setFormCondition(checked);

  return (
    <GenericSwitch
      {...props}
      isChecked={isChecked}
      onChange={handleChange}
      label={tokenLabel}
      title={checkTitle}
      description={checkDescription}
    />
  );
};

export default ToggleToken;
