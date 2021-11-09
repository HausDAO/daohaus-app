import React from 'react';
import { Textarea } from '@chakra-ui/react';

import FieldWrapper from './fieldWrapper';

const GenericTextarea = ({
  label,
  htmlFor,
  name,
  btn,
  helperText,
  defaultValue,
  localForm,
  info,
  h = 10,
  error,
  disabled,
  w,
  layout,
  control,
  registerOptions,
  formState,
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
        key={name}
        id={htmlFor}
        name={name}
        h={h}
        defaultValue={defaultValue}
        ref={register(registerOptions)}
        disabled={disabled || formState === 'loading'}
        control={control}
      />
    </FieldWrapper>
  );
};

export default GenericTextarea;
