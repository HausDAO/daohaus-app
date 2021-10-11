import React, { useEffect, useMemo, useState } from 'react';

import { useDao } from '../contexts/DaoContext';
import InputSelect from './inputSelect';
import ModButton from './modButton';
import { handleDecimals } from '../utils/general';
import {
  getReadableBalanceFromList,
  getReadableBalance,
  getVaultERC20s,
} from '../utils/vaults';
import { validate } from '../utils/validation';

const MinionToken = props => {
  const { daoVaults } = useDao();
  const {
    localForm,
    localValues,
    name,
    listenTo = 'selectedMinion',
    selectName = 'minionToken',
  } = props;
  const { watch, setValue } = localForm;

  const [minionTokens, setMinionTokens] = useState(null);

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
      const commified = handleDecimals(
        tokenData.balance,
        tokenData.decimals,
      )?.toFixed(4);
      return commified;
    }

    if (localValues?.balance) {
      return handleDecimals(
        localValues.balance,
        localValues.tokenDecimals,
      )?.toFixed(4);
    }

    return null;
  }, [minionToken, minionTokens]);

  useEffect(() => {
    if (daoVaults && selectedMinion) {
      const minionErc20s = getVaultERC20s(daoVaults, selectedMinion);
      if (minionErc20s?.length && !localValues?.tokenAddress) {
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

  return (
    <InputSelect
      {...props}
      selectName='minionToken'
      options={minionTokenDisplay}
      disabled={isDisabled}
      helperText={!selectedMinion && 'Please select a minion'}
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
