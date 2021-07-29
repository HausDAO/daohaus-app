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
<<<<<<< HEAD
=======
  w,
>>>>>>> 301e5c4f685e488568f7df87c3b7c69f0e9b7ef7
  layout,
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
<<<<<<< HEAD
=======
      w={w}
>>>>>>> 301e5c4f685e488568f7df87c3b7c69f0e9b7ef7
      layout={layout}
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
