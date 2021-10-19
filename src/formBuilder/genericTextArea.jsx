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
  control,
  registerOptions,
}) => {
  const { register } = localForm;
  // console.log(`registerOptions`, registerOptions);
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
        key={name}
        id={htmlFor}
        name={name}
        // placeholder={placeholder || label || htmlFor}
        h={h}
        ref={registerOptions ? register(registerOptions) : register}
        // ref={registerOptions ? register(registerOptions) : register}
        disabled={disabled}
        control={control}
      />
    </FieldWrapper>
  );
};

export default GenericTextarea;
