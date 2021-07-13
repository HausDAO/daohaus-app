import React, { useEffect, useState } from 'react';

import { ModButton } from './staticElements';

import { handleDecimals } from '../utils/general';
import GenericInput from './genericInput';

const getMaxBalance = (tokenData, tokenAddress) => {
  const token = tokenData.find(t => t.value === tokenAddress);

  if (token) {
    return handleDecimals(token.balance, token.decimals);
  }
};

const MinonTokenSendInput = props => {
  // need to get minion token balance - native or erc20

  const { localForm } = props;
  const { getValues, setValue } = localForm;
  const [balance, setBalance] = useState(null);

  const maxBtnDisplay =
    balance || balance === 0
      ? `Max: ${balance.toFixed(4)}`
      : 'Error: Not found.';

  const setMax = () => {
    // setValue('paymentRequested', balance);
    console.log('setting max');
  };

  return (
    <GenericInput
      {...props}
      btn={<ModButton label={maxBtnDisplay} callback={setMax} />}
    />
  );
};

export default MinonTokenSendInput;
