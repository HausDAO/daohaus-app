import React, { useEffect, useMemo, useState } from 'react';

import { useDao } from '../contexts/DaoContext';
import InputSelect from './inputSelect';
import { ModButton } from './staticElements';

import { validate } from '../utils/validation';
import { handleDecimals } from '../utils/general';
import { getReadableBalanceFromList, getVaultERC20s } from '../utils/vaults';

const MinionToken = props => {
  const { daoVaults } = useDao();
  const {
    localForm,
    name,
    listenTo = 'selectedMinion',
    selectName = 'minionToken',
  } = props;
  const { watch, setValue } = localForm;

  const [minionTokens, setMinionTokens] = useState(null);

  const selectedMinion = watch(listenTo);
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
    return null;
  }, [minionToken, minionTokens]);

  useEffect(() => {
    if (daoVaults && selectedMinion) {
      const minionErc20s = getVaultERC20s(daoVaults, selectedMinion);
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
            callback={setMax}
            label={
              displayableBalance != null ? `Max: ${displayableBalance}` : '--'
            }
          />
        )
      }
    />
  );
};

export default MinionToken;
