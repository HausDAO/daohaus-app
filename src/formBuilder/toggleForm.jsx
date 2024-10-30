import React from 'react';
import { useFormConditions } from '../utils/formBuilder';
import GenericSwitch from './genericSwitch';

const findStartingState = props => {
  if (!props) return;
  const { checked, formCondition } = props;
  return checked === formCondition;
};

const ToggleForm = props => {
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
  const isChecked = findStartingState(props);
  const handleChange = () =>
    isChecked ? setFormCondition(unchecked) : setFormCondition(checked);
  return (
    <GenericSwitch
      {...props}
      isChecked={isChecked}
      onChange={handleChange}
      label={checkLabel}
      title={checkTitle}
      description={checkDescription}
    />
  );
};

export default ToggleForm;
