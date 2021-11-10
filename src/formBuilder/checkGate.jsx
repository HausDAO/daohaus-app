import React, { useState } from 'react';

import GenericCheck from './genericCheck';
import { InputFactory } from './inputFactory';

import { createRegisterOptions, useFormConditions } from '../utils/formBuilder';

const CheckGate = props => {
  const {
    formCondition,
    label,
    title,
    description,
    renderOnCheck,
    required,
  } = props;
  const [checkLabel, checkTitle, checkDescription] = useFormConditions({
    values: [label, title, description],
    condition: formCondition,
  });
  const [isChecked, setIsChecked] = useState(false);
  const handleChange = () => setIsChecked(prevState => !prevState);

  return (
    <>
      {isChecked ? (
        <InputFactory
          {...props}
          {...renderOnCheck}
          registerOptions={createRegisterOptions(renderOnCheck, required)}
        />
      ) : (
        <GenericCheck
          {...props}
          isChecked={isChecked}
          onChange={handleChange}
          label={checkLabel}
          title={checkTitle}
          description={checkDescription}
        />
      )}
    </>
  );
};

export default CheckGate;
