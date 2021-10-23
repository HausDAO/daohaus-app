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
              ...daoVaults.find(v => v.address === minion.minionAddress),
            }))
        );
      })
      .map(minion => ({
        safe: minion.safeAddress,
        value: minion.minionAddress,
        name: minion.details,
      }));
  }, []);

  useEffect(() => {
    register('selectedSafeAddress');

    if (localValues && localValues.minionAddress) {
      setValue(name, localValues.minionAddress);
    }
    if (localValues && localValues.safeAddress) {
      setValue('selectedSafeAddress', localValues.safeAddress);
    }
  }, [name]);

  useEffect(() => {
    if (minionAddress) {
      const safeAddress = minions.filter(
        minion => minion.value === minionAddress,
      )?.[0]?.safe;

      setValue('selectedSafeAddress', safeAddress);
    }
  }, [minionAddress]);

  return <GenericSelect {...props} options={minions} />;
};

export default MinionSelect;
