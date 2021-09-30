import React from 'react';
import { useFormConditions } from '../utils/formBuilder';
import GenericCheck from './genericCheck';

const findStartingState = props => {
  if (!props) return;
  const { listenTo, checked, formCondition, startsChecked } = props;
  if (listenTo === 'formCondition') return checked === formCondition;
  if (!listenTo) return startsChecked;
};

const CheckSwitch = props => {
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
    <GenericCheck
      isChecked={isChecked}
      onChange={handleChange}
      label={checkLabel}
      title={checkTitle}
      description={checkDescription}
    />
  );
};

export default CheckSwitch;
