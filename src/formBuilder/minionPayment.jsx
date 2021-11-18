import React, { useEffect, useMemo, useState } from 'react';

import { useDao } from '../contexts/DaoContext';
import InputSelect from './inputSelect';
import ModButton from './modButton';
import { handleDecimals } from '../utils/general';
import { getReadableBalanceFromList, getVaultERC20s } from '../utils/vaults';
import { validate } from '../utils/validation';
import { getContractBalance, getReadableBalance } from '../utils/tokenValue';
import { spreadOptions } from '../utils/formBuilder';

const MinionToken = props => {
  const { daoVaults } = useDao();
  const {
    localForm,
    localValues,
    name,
    listenTo = 'selectedMinion',
    selectName = 'minionToken',
    registerOptions,
  } = props;
  const { watch, setValue } = localForm;

  const [minionTokens, setMinionTokens] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);

  const selectedMinion = localValues?.minionAddress || watch(listenTo);
  const minionToken = watch(selectName);

  const isDisabled = useMemo(() => {
    return !validate.address(selectedMinion);
  }, [selectedMinion]);

  const minionTokenDisplay = useMemo(() => {
    if (minionTokens) {
      return minionTokens.map(token => ({
        value: token.contractAddress,
        name: token.symbol,
      }));
    }
    return null;
  }, [minionTokens]);

  const displayableBalance = useMemo(() => {
    if (validate.address(minionToken) && minionTokens) {
      const tokenData = minionTokens?.find(
        token => token.contractAddress === minionToken,
      );
      if (tokenData) {
        const { balance, decimals } = tokenData;
        const commified = handleDecimals(balance, decimals)?.toFixed(4);

        setSelectedToken(tokenData);
        return commified;
      }
    }

    if (localValues?.balance && localValues?.tokenDecimals) {
      setSelectedToken(localValues);
      return handleDecimals(
        localValues.balance,
        localValues.tokenDecimals,
      )?.toFixed(4);
    }

    return null;
  }, [minionToken, minionTokens]);

  useEffect(() => {
    if (daoVaults && selectedMinion) {
      const minionErc20s = getVaultERC20s(
        daoVaults,
        selectedMinion,
        localValues?.tokenAddress,
      );

      if (minionErc20s?.length) {
        setMinionTokens(minionErc20s);
      } else {
        setMinionTokens(false);
      }
    }
    if (daoVaults && !selectedMinion) setMinionTokens(null);
  }, [daoVaults, selectedMinion]);

  const setMax = () => {
    if (minionToken && minionTokens) {
      const balance = getReadableBalanceFromList(minionTokens, minionToken);

      setValue(name, balance);
    }

    if (localValues?.balance) {
      const formattedBalance = getReadableBalance({
        balance: localValues.balance,
        decimals: localValues.tokenDecimals,
      });

      setValue(name, formattedBalance);
    }
  };
  const options = spreadOptions({
    registerOptions,
    setValueAs: val =>
      getContractBalance(
        val,
        localValues?.tokenDecimals || selectedToken?.decimals,
      ),
  });

  return (
    <InputSelect
      {...props}
      selectName='minionToken'
      options={minionTokenDisplay}
      disabled={isDisabled}
      helperText={!selectedMinion && 'Please select a minion'}
      registerOptions={options}
      btn={
        selectedMinion && (
          <ModButton
            fn={setMax}
            text={
              displayableBalance != null ? `Max: ${displayableBalance}` : '--'
            }
          />
        )
      }
    />
  );
};

export default MinionToken;
