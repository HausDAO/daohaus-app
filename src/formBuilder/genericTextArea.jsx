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
  w,
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
      w={w}
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
