import React from 'react';
import { Textarea } from '@chakra-ui/react';

import FieldWrapper from './fieldWrapper';

const GenericTextarea = ({
  label,
  htmlFor,
  name,
  btn,
  helperText,
  localForm,
  info,
  h = 10,
  errors,
  disabled,
  w,
  layout,
  control,
  registerOptions,
  formState,
  placeholder,
}) => {
  const { register } = localForm;

  return (
    <FieldWrapper
      label={label}
      htmlFor={htmlFor}
      info={info}
      helperText={helperText}
      btn={btn}
      errors={errors}
      w={w}
      layout={layout}
      name={name}
    >
      <Textarea
        key={name}
        id={htmlFor}
        name={name}
        h={h}
        ref={register(registerOptions)}
        disabled={disabled || formState === 'loading'}
        control={control}
        placeholder={placeholder}
      />
    </FieldWrapper>
  );
};

export default GenericTextarea;
