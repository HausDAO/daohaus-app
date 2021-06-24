import React from 'react';
import { Textarea } from '@chakra-ui/react';

import FieldWrapper from './fieldWrapper';

const GenericTextarea = ({
  label,
  htmlFor,
  placeholder,
  name,
  btn,
  helperText,
  localForm,
  info,
  h = 10,
  error,
  disabled,
}) => {
  const { register } = localForm;

  return (
    <FieldWrapper
      label={label}
      htmlFor={htmlFor}
      info={info}
      helperText={helperText}
      btn={btn}
      error={error}
    >
      <Textarea
        id={htmlFor}
        name={name}
        placeholder={placeholder || label || htmlFor}
        h={h}
        ref={register}
        disabled={disabled}
      />
    </FieldWrapper>
  );
};

export default GenericTextarea;
