import React from 'react';
import { Box, Select, FormLabel } from '@chakra-ui/react';

import {
  UBERHAUS_STAKING_TOKEN,
  UBERHAUS_STAKING_TOKEN_SYMBOL,
} from '../utils/uberhaus';
import TextBox from '../components/TextBox';

const temporaryTokenOptions = [
  { name: UBERHAUS_STAKING_TOKEN_SYMBOL, value: UBERHAUS_STAKING_TOKEN },
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
        {temporaryTokenOptions.map((token) => (
          <option key={token.value} value={token.value}>
            {token.name}
          </option>
        ))}
      </Select>
    </Box>
  );
};

export default TokenSelect;
