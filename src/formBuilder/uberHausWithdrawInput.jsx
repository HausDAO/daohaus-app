import React, { useEffect, useState } from 'react';

import InputSelect from './inputSelect';
import ModButton from './modButton';
import { UBERHAUS_DATA } from '../utils/uberhaus';

const UberHausWithdrawInput = props => {
  const [balance, setBalance] = useState(null);
  const [daoTokens, setDaoTokens] = useState([]);
  const [decimals, setDecimals] = useState(null);
  const { localForm, localValues } = props;
  const { setValue } = localForm;

  const btnDisplay = () => {
    if (balance) return `Max: ${balance}`;
    return '0';
  };

  useEffect(() => {
    if (
      !localValues.uberMembers ||
      !localValues.minionAddress ||
      !localValues.withdrawToken
    )
      return;

    const uberMinionMember = localValues.uberMembers.find(
      member => member.memberAddress === localValues.minionAddress,
    );
    if (uberMinionMember) {
      const { tokenBalances } = uberMinionMember;
      const token = tokenBalances.find(
        ({ token }) =>
          token.tokenAddress === localValues.withdrawToken?.toLowerCase(),
      );

      setBalance(token?.tokenBalance);
      setDecimals(UBERHAUS_DATA.STAKING_TOKEN_DECIMALS);
      setDaoTokens([
        {
          value: UBERHAUS_DATA.STAKING_TOKEN,
          name: UBERHAUS_DATA.STAKING_TOKEN_SYMBOL,
          decimals: UBERHAUS_DATA.STAKING_TOKEN_DECIMALS,
          balance: token.tokenBalance,
        },
      ]);
    }
  }, [
    localValues.uberMembers,
    localValues.uberHausMinion,
    localValues.withdrawToken,
  ]);

  const setMax = () => {
    setValue('withdraw', balance / 10 ** decimals);
  };

  return (
    <InputSelect
      {...props}
      selectName='tributeToken'
      options={daoTokens}
      btn={<ModButton text={btnDisplay()} fn={setMax} />}
    />
  );
};

export default UberHausWithdrawInput;
