import React from 'react';
import { Box, Select, FormLabel } from '@chakra-ui/react';

import { UBERHAUS_DATA } from '../utils/uberhaus';
import TextBox from '../components/TextBox';

const temporaryTokenOptions = [
  {
    name: UBERHAUS_DATA.STAKING_TOKEN_SYMBOL,
    value: UBERHAUS_DATA.STAKING_TOKEN,
  },
];

const TokenSelect = ({
  selectProps = {},
  label = 'token',
  id,
  register,
  name,
  disabled,
}) => {
  return (
    <Box>
      <TextBox as={FormLabel} size='xs' htmlFor={id} mb={2}>
        {label}
      </TextBox>
      <Select
        {...selectProps}
        id={id}
        ref={register}
        name={name}
        placeholder='--Select Token--'
        color='whiteAlpha.900'
        disabled={disabled}
      >
        {temporaryTokenOptions.map(token => (
          <option key={token.value} value={token.value}>
            {token.name}
          </option>
        ))}
      </Select>
    </Box>
  );
};

export default TokenSelect;
