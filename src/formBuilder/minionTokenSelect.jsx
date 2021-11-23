import React, { useEffect, useMemo, useState } from 'react';

import { useDao } from '../contexts/DaoContext';
import GenericSelect from './genericSelect';
import { getVaultERC20s } from '../utils/vaults';

const MinionTokenSelect = props => {
  const { daoVaults } = useDao();
  const { localForm, localValues, name } = props;
  const { watch } = localForm;

  const [minionTokens, setMinionTokens] = useState(null);
  const selectedMinion = localValues?.minionAddress || watch('selectedMinion');
  const selectedToken = watch(name);

  const minionTokenDisplay = useMemo(() => {
    if (minionTokens) {
      return minionTokens.map(token => ({
        value: token.contractAddress,
        name: token.symbol,
      }));
    }
    return null;
  }, [minionTokens]);

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

  return (
    <GenericSelect
      {...props}
      options={minionTokenDisplay}
      disabled={!selectedMinion}
      helperText={selectedMinion ? selectedToken : 'Select a Minion'}
    />
  );
};

export default MinionTokenSelect;
