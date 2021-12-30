import React, { useEffect, useMemo, useState } from 'react';

import InputSelect from './inputSelect';
import ModButton from './modButton';
import { createContract } from '../utils/contract';
import { handleDecimals } from '../utils/general';
import { getContractBalance } from '../utils/tokenValue';
import { LOCAL_ABI } from '../utils/abi';
import { spreadOptions } from '../utils/formBuilder';
import { UBERHAUS_DATA } from '../utils/uberhaus';

const UberHausWithdrawInput = props => {
  const { localForm, registerOptions, localValues } = props;
  const { setValue } = localForm;

  const [daoTokens, setDaoTokens] = useState([]);
  const [balance, setBalance] = useState(null);
  const [decimals, setDecimals] = useState(null);

  const displayBalance = useMemo(() => {
    if (balance && decimals) {
      const commified = handleDecimals(balance, decimals)?.toFixed(4);
      return commified;
    }
    return 'Error';
  }, [balance, decimals]);

  const btnDisplay = () => {
    if (displayBalance) return `Max: ${displayBalance}`;
    return '0';
  };

  useEffect(() => {
    const setupTokenData = async () => {
      const tokenContract = createContract({
        address: UBERHAUS_DATA.STAKING_TOKEN,
        abi: LOCAL_ABI.ERC_20,
        chainID: UBERHAUS_DATA.NETWORK,
      });

      const tokenBalance = await tokenContract.methods
        .balanceOf(localValues.minionAddress)
        .call();

      setBalance(tokenBalance);
      setDecimals(UBERHAUS_DATA.STAKING_TOKEN_DECIMALS);

      setDaoTokens([
        {
          value: UBERHAUS_DATA.STAKING_TOKEN,
          name: UBERHAUS_DATA.STAKING_TOKEN_SYMBOL,
          decimals: UBERHAUS_DATA.STAKING_TOKEN_DECIMALS,
          balance: tokenBalance,
        },
      ]);
    };
    if (localValues) {
      setupTokenData();
    }
  }, [localValues]);

  const setMax = () => {
    setValue('tributeOffered', balance / 10 ** decimals);
  };

  const options = spreadOptions({
    registerOptions,
    setValueAs: val => getContractBalance(val, decimals),
    validate: {
      hasBalance: val =>
        getContractBalance(val, decimals) > Number(balance)
          ? `Amount entered exceeds wallet balance.`
          : true,
    },
  });

  return (
    <InputSelect
      {...props}
      selectName='tributeToken'
      options={daoTokens}
      registerOptions={options}
      btn={<ModButton text={btnDisplay()} fn={setMax} />}
    />
  );
};

export default UberHausWithdrawInput;
