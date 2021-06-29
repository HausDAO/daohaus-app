import { Input, InputGroup, InputRightAddon } from '@chakra-ui/input';

import React, { useMemo } from 'react';

import TextBox from '../components/TextBox';
import { validate, TYPE_ERR_MSGS } from '../utils/validation';
import FieldWrapper from './fieldWrapper';

const GenericFormDisplay = props => {
  const {
    localForm,
    name,
    listenTo,
    override,
    label,
    fallback,
    expectType,
    append,
    variant,
  } = props;
  const { register, watch } = localForm;
  const localWatch = listenTo && watch(listenTo);
  const value = override || localWatch;
  const display = useMemo(() => {
    if (
      expectType &&
      value != null &&
      validate[expectType]?.(value) === false
    ) {
      return TYPE_ERR_MSGS[expectType];
    }
    return value;
  }, [value, expectType]);

  return (
    <FieldWrapper label={label} {...props}>
      <InputGroup>
        <Input type='hidden' name={name} ref={register} />
        <TextBox size='sm' variant={variant}>
          {display || fallback}
        </TextBox>
        {append && (
          <InputRightAddon background='primary.600' p={0}>
            {append}
          </InputRightAddon>
        )}
      </InputGroup>
    </FieldWrapper>
  );
};

export default GenericFormDisplay;
