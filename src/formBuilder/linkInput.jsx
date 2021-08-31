import React, { useEffect } from 'react';
import { validate } from '../utils/validation';

import GenericInput from './genericInput';

const FORM_DISABLE = {
  message: 'Nope. Fix your crap, cowboy.',
};

const LinkInput = props => {
  const { localForm, name, useFormError } = props;
  const { removeError, addError } = useFormError();
  const value = localForm?.watch?.(name);

  useEffect(() => {
    if (validate.address(value)) {
      removeError(name, value);
    } else if (value === '') {
      removeError(name, value);
    } else {
      addError(name, FORM_DISABLE, value);
    }
  }, [value, name]);

  return <GenericInput {...props} prepend='https://' />;
};
export default LinkInput;
