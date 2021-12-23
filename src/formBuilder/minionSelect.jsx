import React, { useMemo, useEffect } from 'react';

import { useDao } from '../contexts/DaoContext';
import GenericSelect from './genericSelect';

const MinionSelect = props => {
  const { daoOverview, daoVaults } = useDao();
  const { name, localForm, localValues } = props;
  const { setValue, register, watch } = localForm;

  const minionAddress = watch(name);

  const minions = useMemo(() => {
    return daoOverview.minions
      .filter(minion => {
        const customFilter = props.filters?.[minion.minionType];
        return (
          minion.minionType === props.minionType &&
          (!customFilter ||
            customFilter({
              ...minion,
              ...daoVaults?.find(v => v.address === minion.minionAddress),
            }))
        );
      })
      .map(minion => ({
        safe: minion.safeAddress,
        value: minion.minionAddress,
        name: minion.details,
        crossChain: minion.crossChainMinion,
        foreignChainId: minion.foreignChainId,
        foreignSafeAddress: minion.foreignSafeAddress,
      }));
  }, [daoOverview, daoVaults]);

  useEffect(() => {
    register('selectedSafeAddress');
    register('crossChainMinion');
    register('foreignChainId');
    register('foreignSafeAddress');

    if (localValues && localValues.minionAddress) {
      setValue(name, localValues.minionAddress);
    }
    if (localValues && localValues.safeAddress) {
      setValue('selectedSafeAddress', localValues.safeAddress);
    }
    if (localValues && localValues.crossChainMinion) {
      setValue('crossChainMinion', localValues.crossChainMinion);
    }
    if (localValues && localValues.foreignChainId) {
      setValue('foreignChainId', localValues.foreignChainId);
    }
    if (localValues && localValues.foreignSafeAddress) {
      setValue('foreignSafeAddress', localValues.foreignSafeAddress);
    }
  }, [name]);

  useEffect(() => {
    if (minionAddress) {
      const {
        safe,
        crossChain,
        foreignChainId,
        foreignSafeAddress,
      } = minions.filter(minion => minion.value === minionAddress)?.[0];

      setValue('selectedSafeAddress', safe);

      if (crossChain) {
        setValue('crossChainMinion', crossChain);
        setValue('foreignChainId', foreignChainId);
        setValue('foreignSafeAddress', foreignSafeAddress);
      }
    }
  }, [minionAddress]);

  return (
    <GenericSelect {...props} options={minions} helperText={minionAddress} />
  );
};

export default MinionSelect;
