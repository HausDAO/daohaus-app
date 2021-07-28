import React, { useEffect, useState } from 'react';

import { useDao } from '../contexts/DaoContext';
import InputSelect from './inputSelect';
import { ModButton } from './staticElements';

import { handleDecimals } from '../utils/general';
import FieldWrapper from './fieldWrapper';

const getMaxBalance = (tokenData, tokenAddress) => {
  //  Uses token select data structure
  const token = tokenData.find(t => t.value === tokenAddress);

  if (token) {
    return handleDecimals(token.balance, token.decimals);
  }
};

const PriceInput = props => {
  const { daoOverview } = useDao();
  const { localForm } = props;
  const { getValues, setValue, watch } = localForm;

  const [daoTokens, setDaoTokens] = useState([]);
  const [balance, setBalance] = useState(null);

  const paymentToken = watch('paymentToken');
  const maxBtnDisplay =
    balance || balance === 0
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
      const bal = getMaxBalance(daoTokens, tokenAddr);
      setBalance(bal);
    }
  }, [daoTokens, paymentToken]);

  console.log(daoTokens);
  const toolTip = (
    <>
      Service fee is <b>2.5%</b>
      <br />
      You will receive{' '}
      <b>
        {/* {getValues('paymentRequested')} */}
        {paymentToken}
      </b>
    </>
  );

  return (
    <InputSelect
      {...props}
      info={toolTip}
      selectName='paymentToken'
      options={daoTokens}
      // helperText={unlocked || 'Unlock to tokens to submit proposal'}
    />
  );
};

export default PriceInput;
