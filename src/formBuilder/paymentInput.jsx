import React, { useEffect, useMemo, useState } from 'react';

import { useDao } from '../contexts/DaoContext';
import InputSelect from './inputSelect';
import ModButton from './modButton';

import { getContractBalance } from '../utils/tokenValue';
import { validate } from '../utils/validation';
import { handleDecimals } from '../utils/general';
import { spreadOptions } from '../utils/formBuilder';

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
  const [token, setToken] = useState(null);

  const paymentToken = watch('paymentToken');
  const maxBtnDisplay = useMemo(() => {
    if (validate.number(token?.balance) || token?.balance === 0) {
      return `Max: ${handleDecimals(token.balance, token.decimals)?.toFixed(
        4,
      )}`;
    }
    return 'Error: Not found.';
  }, [token]);

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

      if (token?.balance && token.decimals) {
        setToken(token);
      }
    }
  }, [daoTokens, paymentToken]);

  const setMax = () => {
    if (!token?.balance) return;
    setValue('paymentRequested', token.balance / 10 ** token.decimals);
  };

  const options = spreadOptions({
    registerOptions,
    setValueAs: value => getContractBalance(value, token?.decimals),
    validate: {
      hasBalance: value =>
        getContractBalance(value, token?.decimals) <= Number(token?.balance)
          ? true
          : 'Not enough balance in DAO treasury',
    },
  });

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
