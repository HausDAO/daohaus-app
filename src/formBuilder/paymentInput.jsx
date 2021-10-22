import React, { useEffect, useState } from 'react';

import { useDao } from '../contexts/DaoContext';
import InputSelect from './inputSelect';
import ModButton from './modButton';
import { handleDecimals } from '../utils/general';
import { validate } from '../utils/validation';
import { getContractBalance, getReadableBalance } from '../utils/tokenValue';

// const getMaxBalance = (tokenData, tokenAddress) => {
//   //  Uses token select data structure

//   const token = tokenData.find(t => t.value === tokenAddress);

//   if (token) {
//     return handleDecimals(token.balance, token.decimals);
//   }
// };

// const validateBalance = (balance, value) => Number(value) > Number(balance);

const PaymentInput = props => {
  const { daoOverview } = useDao();
  const { localForm, registerOptions = {} } = props;
  const { getValues, setValue, watch } = localForm;

  const [daoTokens, setDaoTokens] = useState([]);
  const [balance, setBalance] = useState(null);
  const [decimals, setDecimals] = useState(null);

  const paymentToken = watch('paymentToken');
  const maxBtnDisplay =
    (balance !== '--' && balance) || balance === 0
      ? `Max: ${balance.toFixed(4)}`
      : 'Error: Not found.';

  useEffect(() => {
    if (daoOverview) {
      const depTokenAddress = daoOverview.depositToken?.tokenAddress;
      const depositToken = daoOverview.tokenBalances?.find(
        token =>
          token.guildBank && token.token.tokenAddress === depTokenAddress,
      );
      const nonDepTokens = daoOverview.tokenBalances.filter(
        token =>
          token.guildBank && token.token.tokenAddress !== depTokenAddress,
      );

      setDaoTokens(
        [depositToken, ...nonDepTokens]
          .filter(token => token.token.symbol)
          .map(token => ({
            value: token.token.tokenAddress,
            name: token.token.symbol || token.token.tokenAddress,
            decimals: token.token.decimals,
            balance: token.tokenBalance,
          })),
      );
    }
  }, [daoOverview]);

  useEffect(() => {
    const tokenAddr = paymentToken || getValues('paymentToken');
    if (daoTokens?.length && tokenAddr) {
      const token = daoTokens.find(token => token.value === tokenAddr);
      setBalance(
        getReadableBalance({
          balance: token.balance,
          decimals: token.decimals,
        }),
      );
      setDecimals(token.decimals);
    }
  }, [daoTokens, paymentToken]);

  const setMax = () => {
    setValue('paymentRequested', balance);
  };

  const options = {
    ...registerOptions,
    setValueAs: value => getContractBalance(value, decimals),
    validate: {
      hasBalance: value =>
        Number(value) > Number(balance)
          ? true
          : 'Not enough balance in DAO treasury',
    },
  };

  return (
    <InputSelect
      {...props}
      registerOptions={options}
      selectName='paymentToken'
      options={daoTokens}
      // helperText={unlocked || 'Unlock to tokens to submit proposal'}
      btn={<ModButton text={maxBtnDisplay} fn={setMax} />}
    />
  );
};

export default PaymentInput;
