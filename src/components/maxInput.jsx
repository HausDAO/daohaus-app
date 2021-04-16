import React from 'react';
import {
  Button,
  Box,
  FormLabel,
  InputGroup,
  Input,
  FormHelperText,
} from '@chakra-ui/react';

import TextBox from './TextBox';

const MaxOutInput = ({
  label = 'labelPlaceholder',
  setValue,
  register,
  name,
  helperText,
  max,
  id,
  containerProps = {},
  validationPattern = {},
  disabled,
}) => {
  const setMax = () => {
    setValue(name, max);
  };
  return (
    <Box {...containerProps}>
      <TextBox as={FormLabel} size='xs' htmlFor={id} mb={2}>
        {label}
      </TextBox>
      <InputGroup>
        <Button
          onClick={setMax}
          size='xs'
          position='absolute'
          right='0'
          top='-30px'
          variant='outline'
          disabled={disabled}
        >
          {`Max: ${max}`}
        </Button>
        <Input
          name={name}
          placeholder='0'
          id={id}
          ref={register({
            pattern: validationPattern,
          })}
          color='white'
          focusBorderColor='secondary.500'
          disabled={disabled}
        />
      </InputGroup>
      <FormHelperText>{helperText}</FormHelperText>
    </Box>
  );
};

export default MaxOutInput;
