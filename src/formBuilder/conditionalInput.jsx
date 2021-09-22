import React, { useState } from 'react';
import {
  Checkbox,
  Flex,
  Input,
  InputLeftAddon,
  InputGroup,
  InputRightAddon,
} from '@chakra-ui/react';

import FieldWrapper from './fieldWrapper';
import Paragraphs from './Paragraphs';

const ConditionalInput = props => {
  const {
    conditionalLabel,
    conditionalDesc,
    label,
    htmlFor,
    placeholder,
    name,
    localForm,
    append,
    prepend,
    onChange = null,
    disabled,
    defaultValue,
  } = props;
  const { register, setValue } = localForm;
  const [checked, setChecked] = useState(false);

  return (
    <Flex flexDir='Column'>
      <Checkbox
        name={`${name}Condition`}
        size='lg'
        borderColor='white'
        colorScheme='blackAlpha'
        iconColor='red.400'
        iconSize='2rem'
        spacing='1rem'
        onChange={ev => {
          setChecked(ev.target.checked);
          setValue(
            name,
            ev.target.checked
              ? ''
              : typeof defaultValue === 'function'
              ? defaultValue()
              : defaultValue,
          );
        }}
      >
        {conditionalLabel}
      </Checkbox>
      {conditionalDesc && <Paragraphs pars={[conditionalDesc]} ml={9} />}
      <FieldWrapper {...props} hidden={!checked}>
        <InputGroup>
          {prepend && (
            <InputLeftAddon background='primary.600'>{prepend}</InputLeftAddon>
          )}
          <Input
            id={htmlFor}
            name={name}
            onChange={onChange}
            placeholder={placeholder || label || htmlFor}
            ref={register}
            disabled={disabled}
            defaultValue={
              typeof defaultValue === 'function' ? defaultValue() : defaultValue
            }
          />
          {append && (
            <InputRightAddon background='primary.600' p={4}>
              {append}
            </InputRightAddon>
          )}
        </InputGroup>
      </FieldWrapper>
    </Flex>
  );
};

export default ConditionalInput;
