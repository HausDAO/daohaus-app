import React from 'react';
import { Flex, Switch } from '@chakra-ui/react';
import TextBox from '../components/TextBox';
import FieldWrapper from './fieldWrapper';

const GenericSwitch = props => {
  const {
    label,
    title,
    isChecked = true,
    onChange,
    name,
    registerOptions,
    localForm,
  } = props;

  const { register } = localForm;

  return (
    <FieldWrapper {...props} label={title}>
      <Flex flexDir='row'>
        <Switch
          name={name}
          value={isChecked}
          onChange={onChange}
          size='lg'
          ref={name ? register(registerOptions) : null}
          borderColor='grey'
          width='fit-content'
        />
        <TextBox size='sm' variant='body' ml='4' mt='1'>
          {label}
        </TextBox>
      </Flex>
    </FieldWrapper>
  );
};

export default GenericSwitch;
