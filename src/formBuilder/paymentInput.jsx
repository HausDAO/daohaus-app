import React, { useEffect, useMemo, useState } from 'react';

import { useDao } from '../contexts/DaoContext';
import InputSelect from './inputSelect';
import ModButton from './modButton';

import { getContractBalance } from '../utils/tokenValue';
import { validate } from '../utils/validation';
import { handleDecimals } from '../utils/general';
import { spreadOptions } from '../utils/formBuilder';

const PaymentInput = props => {
  const { daoOverview } = useDao();
  const {
    localForm,
    localValues,
    registerOptions = {},
    depositTokenOnly,
    hideMax,
  } = props;
  const { getValues, setValue, watch } = localForm;

  const [daoTokens, setDaoTokens] = useState([]);
  const [token, setToken] = useState(null);

  const paymentToken = watch('paymentToken');
  const maxBtnDisplay = useMemo(() => {
    if (validate.number(token?.balance) || token?.balance === 0) {
      return `Max: ${Math.floor(
        handleDecimals(token.balance, token.decimals) * 10_000,
      ) / 10_000}`;
    }
    return 'Error: Not found.';
  }, [token]);

  useEffect(() => {
    if (daoOverview) {
      const depTokenAddress =
        localValues?.defaultPaymentToken ||
        daoOverview.depositToken?.tokenAddress;
      const depositToken = daoOverview.tokenBalances?.find(
        token =>
          token.guildBank && token.token.tokenAddress === depTokenAddress,
      );
      const nonDepTokens = daoOverview.tokenBalances.filter(
        token =>
          !depositTokenOnly &&
          token.guildBank &&
          token.token.tokenAddress !== depTokenAddress,
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
    setValue(
      'paymentRequested',
      Math.floor(handleDecimals(token.balance, token.decimals) * 10_000) /
        10_000,
    );
  };

  const options = spreadOptions({
    registerOptions,
    setValueAs: value => getContractBalance(value, token?.decimals),
    validate: {
      hasBalance: value => {
        depositTokenOnly ||
        Number(getContractBalance(value, token?.decimals)) <=
          Number(token?.balance)
          ? true
          : 'Not enough balance in Wallet';
      },
    },
  });

  return (
    <InputSelect
      {...props}
      registerOptions={options}
      selectName='paymentToken'
      options={daoTokens}
      btn={!hideMax && <ModButton text={maxBtnDisplay} fn={setMax} />}
    />
  );
};

export default PaymentInput;
